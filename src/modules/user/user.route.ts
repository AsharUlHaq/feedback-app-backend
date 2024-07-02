import { Router } from "express";
import { userController } from "./user.controller";
import { protect } from "../../middleware/protect.middleware";
import { handlerMiddleware } from "../../middleware/handler.middleware";

export const userRoutes = Router()
  .get(
    "/user/me",
    protect,
    handlerMiddleware(userController.getUserDetailHandler)
  )
  .patch("/", protect, handlerMiddleware(userController.updateHandler));
