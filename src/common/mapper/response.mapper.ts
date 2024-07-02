import type { Response } from "express";
import { HttpStatus } from "../../utils/http-status.util";

type IResponseArgs = {
  res: Response;
  message?: string;
  status?: number;
  data?: any;
};

export class ResponseMapper {
  public static map({
    res,
    data = null,
    message = HttpStatus.OK_MESSAGE,
    status = HttpStatus.OK,
  }: IResponseArgs) {
    return res.status(status).json({
      status,
      message,
      data,
      success: status >= HttpStatus.OK && status < HttpStatus.MULTIPLE_CHOICES,
    });
  }
}
