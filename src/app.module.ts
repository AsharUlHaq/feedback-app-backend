import type { Express, Router } from "express";
import { notFoundMiddleware } from "./middleware/not-found.middleware";

import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.route";
import { adminRoutes } from "./modules/admin/admin.route";

const routesArray: Router[] = [authRoutes, userRoutes, adminRoutes];

export class AppModule {
  static init(app: Express) {
    routesArray.forEach((eachRouter) => app.use("/api/", eachRouter));
    //! FOR UNKNOWN ROUTES
    app.use("*", notFoundMiddleware);
  }
}
