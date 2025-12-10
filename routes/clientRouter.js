import express from "express";

import { clientHomeController, clientAllController, clientFavouritesController, clientFavouritesPostController, clientBookingsController, clientHomeDetailsController, clientFavRemoveController } from "../controllers/clientControllers.js";

const clientRouter = express.Router();

clientRouter.get("/", clientHomeController);

clientRouter.get("/all", clientAllController);

clientRouter.get("/favourites", clientFavouritesController);

clientRouter.post("/favourites", clientFavouritesPostController);

clientRouter.get("/bookings", clientBookingsController);

clientRouter.get("/homeDetails/:homeId", clientHomeDetailsController);

clientRouter.post("/fav/:homeId", clientFavRemoveController);

export default clientRouter;

