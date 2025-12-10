import express from "express";

import { hostHomeController, addHomeController, hostHomePostController, editHomeController, editHomePostController, removeHomePostController } from "../controllers/hostControllers.js";

const hostRouter = express.Router();

hostRouter.get("/", hostHomeController);

hostRouter.post("/added", hostHomePostController);

hostRouter.get("/addHome", addHomeController);

hostRouter.get("/editHome/:homeId", editHomeController);

hostRouter.post("/editHome/:homeId", editHomePostController);

hostRouter.post("/remove/:homeId", removeHomePostController);

export default hostRouter;