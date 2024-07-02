import type { Handler } from "express";
import { BadRequestException } from "../utils/exception.util";
import { jwtService } from "../modules/jwt/jwt.service";
import { User } from "@prisma/client";
import { ResponseMapper } from "../common/mapper/response.mapper";
import { HttpStatus } from "../utils/http-status.util";

export const protect: Handler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error();
    if (!authHeader.startsWith("Bearer")) throw new Error();

    const [, token] = authHeader.split(" ");
    if (!token) throw new Error();

    const payload = (await jwtService.verifyToken(token)) as User;
    req["userId"] = payload.id;

    next();
  } catch (error) {
    return ResponseMapper.map({
      res,
      status: HttpStatus.UNAUTHORIZED,
      message: HttpStatus.UNAUTHORIZED_MESSAGE,
    });
  }
};
