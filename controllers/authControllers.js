import { check, validationResult } from "express-validator";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const signupController = (req, res, next) => {
  res.render("./auth/signup", {
    errors: [],
    oldInput: {},
    isLoggedIn: false,
    user: {},
  });
};

const signupPostController = [
  // first name validation
  check("fname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long")
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("First name must contain only letters and numbers"),

  // last name validation
  check("lname")
    .trim()
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("First name must contain only letters and numbers"),

  // email validation
  check("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  // password validation
  check("pwd")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character")
    .trim(),

  // confirm password validation
  check("conpwd")
    .custom((value, { req }) => {
      if (value !== req.body.pwd) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .trim(),

  // user type validation
  check("usertype")
    .notEmpty()
    .withMessage("User type is required")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  // terms and conditions validation
  check("terms")
    .notEmpty()
    .withMessage("You must accept the terms and conditions")
    .equals("on")
    .withMessage("You must accept the terms and conditions"),

  // final handler
  (req, res, next) => {
    const { fname, lname, email, pwd, usertype } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("./auth/signup", {
        errors: errors.array(),
        oldInput: {
          fname,
          lname,
          email,
          usertype,
        },
        isLoggedIn: false,
        user: {},
      });
    }

    bcrypt
      .hash(pwd, 12)
      .then((hashedPwd) => {
        const newUser = new User({
          firstName: fname,
          lastName: lname,
          email: email,
          password: hashedPwd,
          userType: usertype,
        });
        return newUser.save();
      })
      .then(() => {
        res.redirect("/auth/login");
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).render("./auth/signup", {
          errors: [{ msg: "Server error. Please try again later." }],
          oldInput: {
            fname,
            lname,
            email,
            usertype,
          },
          isLoggedIn: false,
          user: {},
        });
      });
  },
];

const loginController = (req, res) => {
  res.render("./auth/login", {
    errors: [],
    oldInput: {},
    isLoggedIn: false,
    user: {},
  });
};

const loginPostController = [
  check("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  check("pwd").notEmpty().withMessage("Password cannot be empty").trim(),

  async (req, res, next) => {
    const { email, pwd } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("./auth/login", {
        errors: errors.array(),
        oldInput: {
          email,
        },
        isLoggedIn: false,
        user: {},
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).render("./auth/login", {
        errors: [{ msg: "Invalid email or password" }],
        oldInput: {
          email,
        },
        isLoggedIn: false,
        user: {},
      });
    }
    const isMatch = await bcrypt.compare(pwd, user.password);
    if (!isMatch) {
      return res.status(401).render("./auth/login", {
        errors: [{ msg: "Invalid email or password" }],
        oldInput: {
          email,
        },
        isLoggedIn: false,
        user: {},
      });
    }
    // Successful login
    req.session.isLoggedIn = true;
    const { _id, userType } = user;
    req.session.user = { _id, userType };
    return req.session.save((err) => {
      if (err) {
        console.log(err);
      } else {
        if (user.userType === "guest") {
          res.redirect("/client/favourites");
        } else if (user.userType === "host") {
          res.redirect("/host");
        }
      }
    });
  },
];

const logoutController = (req, res, next) => {
  req.session.isLoggedIn = false ;
  res.redirect("/auth/login");
};

export {
  signupController,
  signupPostController,
  loginController,
  loginPostController,
  logoutController,
};
