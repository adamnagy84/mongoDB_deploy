import { Router } from "express";
import {
  getMe,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

//védett route
userRouter.get("/me", requireAuth, getMe);
userRouter.post("/refresh", refreshAccessToken);

export default userRouter;
