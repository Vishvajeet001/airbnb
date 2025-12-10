import Home from "../models/home.js";
import User from "../models/user.js";

const clientHomeController = async (req, res, next) => {
    const allhomes = await Home.find();
    const homes = allhomes.filter(home => home.rating >= 4);
    res.render("./store/home", {
      homes,
      isLoggedIn: req.session.isLoggedIn,
      userType: req.session.user.userType,
    });
}

const clientAllController = async (req, res, next) => {
    const homes = await Home.find();
    res.render("./store/home", {
      homes,
      isLoggedIn: req.session.isLoggedIn,
      userType: req.session.user.userType,
    });
}


const clientBookingsController = (req, res, next) => {
    res.render("./store/bookings",{
        isLoggedIn: req.session.isLoggedIn,
        userType: req.session.user.userType,
    });
}

const clientHomeDetailsController = async (req, res, next) => {
    const homeId = req.params.homeId;
    const home = await Home.findById({ _id: homeId });
    res.render("./store/homeDetails", {
      home,
      isLoggedIn: req.session.isLoggedIn,
      userType: req.session.user.userType,
    });
}


// favourites 
const clientFavouritesController = async (req, res, next) => {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate("favourites");
    res.render("./store/favourites", {
      favs: user.favourites,
      isLoggedIn: req.session.isLoggedIn,
      userType: req.session.user.userType,
    });
}

const clientFavouritesPostController = async (req, res, next) => {
    const homeId = req.body.id;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (!user.favourites.includes(homeId)) {
      user.favourites.push(homeId);
      await user.save();
    }
    res.redirect("/client/favourites");
}

const clientFavRemoveController = async (req, res, next) => {
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (user.favourites.includes(homeId)) {
      user.favourites = user.favourites.filter((fav) => fav != homeId);
      await user.save();
    }
    res.redirect("/client/favourites");
}

export { clientHomeController, clientAllController, clientFavouritesController, clientFavouritesPostController, clientBookingsController, clientHomeDetailsController, clientFavRemoveController };