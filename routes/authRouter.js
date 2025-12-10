import express from "express";

import { loginController, loginPostController, logoutController, signupController, signupPostController } from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.get("/signup", signupController);

authRouter.post("/signup", signupPostController);

authRouter.get("/login", loginController);

authRouter.post("/login", loginPostController);

authRouter.post("/logout", logoutController);

export default authRouter;
