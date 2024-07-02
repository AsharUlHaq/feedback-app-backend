import type { Request } from "express";
import type { User } from "@prisma/client";
import type { AuthTypes } from "./auth.schema";

import { ResponseMapper } from "../../common/mapper/response.mapper";
import {
  BadRequestException,
  NotFoundException,
} from "../../utils/exception.util";

import { jwtService } from "../jwt/jwt.service";
import { userService } from "../user/user.service";
import { authService } from "./auth.service";
import { commonService } from "../common/common.service";
import { LoggerService } from "../../utils/logger.util";

import { JWT_TYPE } from "../jwt/enum/jwt.enum";

class AuthController {
  private readonly logger = LoggerService(AuthController.name);

  async loginHandler(req: Request) {
    try {
      const body = req.body as AuthTypes.Login;
      const user = await userService.findUnique({
        where: { email: body.email },
      });
      if (!user) throw new NotFoundException("User not found");
      if (!user.isActive) throw new BadRequestException("Pending approval");
      if (user.password != body.password)
        throw new BadRequestException("Invalid credentials");

      const userWithoutPassword = commonService.exclude(user, ["password"]);
      const accessToken = await jwtService.signPayload(
        userWithoutPassword,
        JWT_TYPE.ACCESS
      );
      const refreshToken = await jwtService.signPayload(
        userWithoutPassword,
        JWT_TYPE.REFRESH
      );

      await authService.upsert({ userId: user.id, refreshToken });

      return ResponseMapper.map({
        data: { user: userWithoutPassword, accessToken, refreshToken },
      });
    } catch (error: any) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async signupHandler(req: Request) {
    try {
      const body = req.body as AuthTypes.Signup;
      const user = await userService.findUnique({
        where: { email: body.email },
      });
      if (user) throw new BadRequestException("Email already exists");

      await userService.create({
        data: {
          email: body.email,
          password: body.password,
          username: body.username,
        },
      });

      return ResponseMapper.map({ message: "Registered Successfully" });
    } catch (error: any) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async refreshAccessHandler(req: Request) {
    try {
      const body = req.body as AuthTypes.Refresh;
      const session = await authService.findOneByRefreshToken(
        body.refreshToken
      );
      if (!session) throw new NotFoundException("Session not found");

      const user = (await jwtService.verifyToken(
        body.refreshToken,
        JWT_TYPE.REFRESH
      )) as User;
      const userWithoutPassword = commonService.exclude(user, ["password"]);

      const accessToken = await jwtService.signPayload(
        userWithoutPassword,
        JWT_TYPE.ACCESS
      );
      const refreshToken = await jwtService.signPayload(
        userWithoutPassword,
        JWT_TYPE.REFRESH
      );

      return ResponseMapper.map({
        data: { user: userWithoutPassword, refreshToken, accessToken },
      });
    } catch (error: any) {
      this.logger.error(error.message);
      throw error;
    }
  }
}

export const authController =
  commonService.getOrCreateSingleton(AuthController);
