import type { Express, Router } from "express";
import { ResponseMapper } from "./common/mapper/response.mapper";
import { HttpStatus } from "./utils/http-status.util";

import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.route";

const routesArray: Router[] = [authRoutes, userRoutes];

export class AppModule {
  static init(app: Express) {
    routesArray.forEach((eachRouter) => app.use("/api/", eachRouter));
    app.use("*", (req, res) =>
      ResponseMapper.map({
        res,
        status: HttpStatus.NOT_FOUND,
        message: HttpStatus.NOT_FOUND_MESSAGE,
      })
    );
  }
}
