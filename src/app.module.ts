import type { Express, Router } from "express";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.route";

const routesArray: Router[] = [authRoutes, userRoutes];

export class AppModule {
  static init(app: Express) {
    routesArray.map((eachRouter) => app.use("/api/", eachRouter));
  }
}
