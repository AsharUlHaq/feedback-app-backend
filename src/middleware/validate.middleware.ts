import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { HttpStatus } from "../utils/http-status.util";
import { ResponseMapper } from "../common/mapper/response.mapper";
import { zodErrorMapper } from "../common/mapper/zod-mapper";

export const validateSchema = (
  schema: ZodSchema,
  dataPath: "body" | "query" | "params" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[dataPath]);
      next();
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseMapper.map({
          message: zodErrorMapper(error),
          status: HttpStatus.BAD_REQUEST,
        })
      );
    }
  };
};
