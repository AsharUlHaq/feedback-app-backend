import { Router } from "express";
import { authController } from "./auth.controller";
import { validateSchema } from "../../middleware/validate.middleware";
import { AuthSchema } from "./auth.schema";

const authRoutes = Router();

authRoutes.post(
  "/auth/sign-in",
  validateSchema(AuthSchema.loginSchema, "body"),
  async (...obj) => await authController.loginHandler(...obj)
);
authRoutes.post(
  "/auth/sign-up",
  validateSchema(AuthSchema.signupSchema, "body"),
  async (...obj) => await authController.signupHandler(...obj)
);

export { authRoutes };
