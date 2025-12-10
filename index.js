import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import dotenv from "dotenv";

import rootDir from "./utils/path.js";
import connectDB from "./utils/db.js";
import clientRouter from "./routes/clientRouter.js";
import hostRouter from "./routes/hostRouter.js";
import authRouter from "./routes/authRouter.js";
import ensureLoggedIn from "./middlewares/ensureLoggedIn.js";
import requireRole from "./middlewares/requireRole.js";

const app = express();

dotenv.config();
connectDB();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      collectionName: "sessions",
    }),
  })
);

app.use((req, res, next) => {
  console.log(req.method, req.url, { body: req.body });
  if (req.session) {
    console.log("session.isLoggedIn=", !!req.session.isLoggedIn);
    if (req.session.user)
      console.log("session.user.userType=", req.session.user.userType);
  }
  next();
});

app.use(express.static(path.join(rootDir, "public")));

app.use("/auth", authRouter);

app.use("/client", ensureLoggedIn, clientRouter);

app.use("/host", ensureLoggedIn, requireRole("host"), hostRouter);

app.use((req, res, next) => {
  res.render("404", {
    isLoggedIn: req.session.isLoggedIn,
    userType: "",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

