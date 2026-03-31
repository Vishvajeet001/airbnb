import Home from "../models/home.js";

const hostHomeController = async (req, res, next) => {
  // only show homes created by the logged-in host
  try {
    const ownerId = req.session?.user?._id;
    const homes = await Home.find({ owner: ownerId });
    return res.render("./host/hostHomes", {
      homes,
      isLoggedIn: req.session.isLoggedIn,
      userType: req.session.user.userType,
    });
  } catch (err) {
    return next(err);
  }
};

const addHomeController = (req, res, next) => {
  res.render("./host/addHome", {
    isLoggedIn: req.session.isLoggedIn,
    userType: req.session.user.userType,
  });
};

const editHomeController = async (req, res, next) => {
  try {
    const _id = req.params.homeId;
    const home = await Home.findById(_id);
    // only allow owner to edit
    const ownerId = req.session?.user?._id?.toString();
    if (!home || home.owner?.toString() !== ownerId) {
      return res
        .status(403)
        .render("404", {
          isLoggedIn: req.session.isLoggedIn,
          userType: req.session.user?.userType || "",
        });
    }
    return res.render("./host/editHome", {
      home,
      isLoggedIn: req.session.isLoggedIn,
      userType: req.session.user.userType,
    });
  } catch (err) {
    return next(err);
  }
};

const editHomePostController = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const { name, price, location, rating, description } = req.body;
    const home = await Home.findById(homeId);
    const ownerId = req.session?.user?._id?.toString();
    if (!home || home.owner?.toString() !== ownerId) {
      return res
        .status(403)
        .render("404", {
          isLoggedIn: req.session.isLoggedIn,
          userType: req.session.user?.userType || "",
        });
    }
    if (req.files.length === 0) {
      await Home.updateOne(
        { _id: homeId },
        { name, price, location, rating, description }
      );
    } else {
      const photosPaths = req.files.map((file) => file.path);
      await Home.updateOne(
        { _id: homeId },
        { name, price, location, rating, photos: photosPaths, description }
      );
    }
    return res.redirect("/host");
  } catch (err) {
    return next(err);
  }
};

const removeHomePostController = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const home = await Home.findById(homeId);
    const ownerId = req.session?.user?._id?.toString();
    if (!home || home.owner?.toString() !== ownerId) {
      return res
        .status(403)
        .render("404", {
          isLoggedIn: req.session.isLoggedIn,
          userType: req.session.user?.userType || "",
        });
    }
    await Home.deleteOne({ _id: homeId });
    return res.redirect("/host");
  } catch (err) {
    return next(err);
  }
};

const hostHomePostController = async (req, res, next) => {
  try {
    const { name, price, location, rating, description } = req.body;
    const ownerId = req.session?.user?._id;
    const photosPaths = req.files.map((file) => file.path);
    await Home.create({
      name,
      price,
      location,
      rating,
      photos: photosPaths,
      description,
      owner: ownerId,
    });
    return res.redirect("/host");
  } catch (err) {
    return next(err);
  }
};

export {
  hostHomeController,
  addHomeController,
  hostHomePostController,
  editHomeController,
  editHomePostController,
  removeHomePostController,
};
