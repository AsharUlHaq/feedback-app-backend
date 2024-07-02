import { Router } from "express";
import { authController } from "./auth.controller";
import { validateSchema } from "../../middleware/validate.middleware";
import { AuthSchema } from "./auth.schema";

const authRoutes = Router();

authRoutes.post(
  "/auth/sign-in",
  validateSchema(AuthSchema.loginSchema),
  async (...args) => authController.loginHandler(...args)
);
authRoutes.post(
  "/auth/sign-up",
  validateSchema(AuthSchema.signupSchema),
  async (...args) => authController.signupHandler(...args)
);
authRoutes.post(
  "/auth/refresh",
  validateSchema(AuthSchema.refreshSchema),
  async (...args) => authController.refreshAccessHandler(...args)
);

export { authRoutes };
