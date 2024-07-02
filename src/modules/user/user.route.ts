import { Router } from "express";
import { userController } from "./user.controller";
import { protect } from "../../middleware/protect.middleware";
import { handlerMiddleware } from "../../middleware/handler.middleware";

const userRoutes = Router();

userRoutes.get(
  "/user/me",
  protect,
  handlerMiddleware(userController.getUserDetailHandler)
);

export { userRoutes };
