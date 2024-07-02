import { Router } from "express";
import { validateSchema } from "../../middleware/validate.middleware";
import { AdminSchema } from "./admin.schema";
import { adminController } from "./admin.controller";
import { protect } from "../../middleware/protect.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { handlerMiddleware } from "../../middleware/handler.middleware";

export const adminRoutes = Router()
  .use(protect)
  .use(adminMiddleware)
  .post(
    "/admin/toggle-user-status",
    validateSchema(AdminSchema.toggleUserStatusSchema),
    handlerMiddleware(adminController.userStatusToggleHandler)
  );
