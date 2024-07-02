import type { Request } from "express";
import type { UserSchema, UserSchemaTypes } from "./user.schema.ts";
import { LoggerService } from "../../utils/logger.util";
import { commonService } from "../common/common.service";
import { ResponseMapper } from "../../common/mapper/response.mapper";
import { userService } from "./user.service";
import { jwtService } from "../jwt/jwt.service";
import { JWT_TYPE } from "../jwt/enum/jwt.enum";
import { BadRequestException } from "../../utils/exception.util";

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

  async updateHandler(req: Request) {
    try {
      const body = req.body as UserSchemaTypes.Update;
      const user = (await userService.findOneById(req.userId))!;

      let password = user.password;
      if (body.passwordData) {
        if (body.passwordData.oldPassword === user.password)
          throw new BadRequestException("Incorrect password");
        if (body.passwordData.password != body.passwordData.confirmPassword)
          throw new BadRequestException("Password not match");

        password = body.passwordData.password;
      }

      user["username"] = body.username ?? user.username;
      user["password"] = password;

      await userService.update({
        data: commonService.exclude(user, ["updatedAt"]),
        where: { id: req.userId },
      });

      return ResponseMapper.map();
    } catch (error: any) {
      this.logger.error(error.message);
      throw error;
    }
  }
}

export const userController =
  commonService.getOrCreateSingleton(UserController);
