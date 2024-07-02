import type { Handler } from "express";
import { LoggerService } from "../../utils/logger.util";
import { commonService } from "../common/common.service";
import { ResponseMapper } from "../../common/mapper/response.mapper";
import { userService } from "./user.service";

class UserController {
  private readonly logger = LoggerService(UserController.name);

  getUserDetailHandler: Handler = async (req, res, next) => {
    try {
      const userId = req.userId;
      const user = await userService.findOneById(userId);
      const userWithoutPassword = commonService.exclude(user!, ["password"]);

      return ResponseMapper.map({ res, data: { user: userWithoutPassword } });
    } catch (error: any) {
      this.logger.error(error.message);
      next(error);
    }
  };
}

export const userController =
  commonService.getOrCreateSingleton(UserController);
