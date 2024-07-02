import { ErrorRequestHandler } from "express";
import { HttpStatus } from "../utils/http-status.util";
import { ZodError } from "zod";
import { zodErrorMapper } from "../common/mapper/zod-mapper";
import { HttpException } from "../utils/exception.util";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const RESPONSE = {
    status: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
    message: err.message || HttpStatus.INTERNAL_SERVER_ERROR_MESSAGE,
    data: null as any,
    success: false,
  };

  if (err instanceof ZodError) {
    RESPONSE["message"] = zodErrorMapper(err);
    RESPONSE["status"] = HttpStatus.BAD_REQUEST;
  }

  if (err instanceof HttpException) {
    RESPONSE["message"] = err.message;
    RESPONSE["status"] = err.status;
  }

  res.status(RESPONSE.status).json(RESPONSE);
};
