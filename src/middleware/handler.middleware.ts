import type { NextFunction, Request, Response } from "express";

export const handlerMiddleware = (
  func: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<{ status: number; message: string; data: any; success: boolean }>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await func(req, res, next);
      return res.status(response.status).json(response);
      return;
    } catch (error) {
      next(error);
    }
  };
};
