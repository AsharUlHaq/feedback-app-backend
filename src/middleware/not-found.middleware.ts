import { Handler } from "express";
import { HttpStatus } from "../utils/http-status.util";
import { ResponseMapper } from "../common/mapper/response.mapper";

export const notFoundMiddleware: Handler = (_, res) => {
  return res.status(HttpStatus.NOT_FOUND).json(
    ResponseMapper.map({
      status: HttpStatus.NOT_FOUND,
      message: HttpStatus.NOT_FOUND_MESSAGE,
    })
  );
};
