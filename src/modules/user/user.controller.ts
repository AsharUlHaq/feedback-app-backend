import type { Request } from "express";
import { LoggerService } from "../../utils/logger.util";
import { commonService } from "../common/common.service";
import { ResponseMapper } from "../../common/mapper/response.mapper";
import { userService } from "./user.service";
import { jwtService } from "../jwt/jwt.service";
import { JWT_TYPE } from "../jwt/enum/jwt.enum";

class UserController {
  private readonly logger = LoggerService(UserController.name);

  async getUserDetailHandler(req: Request) {
    try {
      const userId = req.userId;
      const user = (await userService.findOneById(userId))!;
      const userWithoutPassword = commonService.exclude(user, ["password"]);

      const refreshToken = await jwtService.signPayload(
        userWithoutPassword,
        JWT_TYPE.REFRESH
      );

      return ResponseMapper.map({
        data: { user: userWithoutPassword, refreshToken },
      });
    } catch (error: any) {
      this.logger.error(error.message);
      throw error;
    }
  }
}

export const userController =
  commonService.getOrCreateSingleton(UserController);
