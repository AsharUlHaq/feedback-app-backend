import type { Handler } from "express";
import { LoggerService } from "../../utils/logger.util";
import { commonService } from "../common/common.service";
import { ResponseMapper } from "../../common/mapper/response.mapper";
import { AuthTypes } from "./auth.schema";
import { userService } from "../user/user.service";
import {
  BadRequestException,
  NotFoundException,
} from "../../utils/exception.util";
import { jwtService } from "../jwt/jwt.service";

class AuthController {
  private readonly logger = LoggerService(AuthController.name);

  public loginHandler: Handler = async (req, res, next) => {
    try {
      const body = req.body as AuthTypes.Login;
      const user = await userService.findUnique({
        where: { email: body.email },
      });
      if (!user) throw new NotFoundException("User not found");
      if (user.password != body.password)
        throw new BadRequestException("Invalid credentials");

      const userWithoutPassword = commonService.exclude(user, ["password"]);
      const token = await jwtService.signPayload(userWithoutPassword);

      return ResponseMapper.map({
        res,
        data: { user: userWithoutPassword, token },
      });
    } catch (error: any) {
      this.logger.error(error.message);
      next(error);
    }
  };

  public signupHandler: Handler = async (req, res, next) => {
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

      return ResponseMapper.map({ res, message: "Registered Successfully" });
    } catch (error: any) {
      this.logger.error(error.message);
      next(error);
    }
  };
}

export const authController =
  commonService.getOrCreateSingleton(AuthController);
