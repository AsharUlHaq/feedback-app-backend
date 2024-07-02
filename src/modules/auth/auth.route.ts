import { Router } from "express";
import { authController } from "./auth.controller";
import { validateSchema } from "../../middleware/validate.middleware";
import { AuthSchema } from "./auth.schema";
import { handlerMiddleware } from "../../middleware/handler.middleware";

const authRoutes = Router();

authRoutes.post(
  "/auth/sign-in",
  validateSchema(AuthSchema.loginSchema),
  handlerMiddleware(authController.loginHandler)
);
authRoutes.post(
  "/auth/sign-up",
  validateSchema(AuthSchema.signupSchema),
  handlerMiddleware(authController.signupHandler)
);
authRoutes.post(
  "/auth/refresh",
  validateSchema(AuthSchema.refreshSchema),
  handlerMiddleware(authController.refreshAccessHandler)
);

export { authRoutes };
