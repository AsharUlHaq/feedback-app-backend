import { Router } from "express";
import { userController } from "./user.controller";
import { protect } from "../../middleware/protect.middleware";

const userRoutes = Router();

userRoutes.get("/user/me", protect, (...args) =>
  userController.getUserDetailHandler(...args)
);

export { userRoutes };
