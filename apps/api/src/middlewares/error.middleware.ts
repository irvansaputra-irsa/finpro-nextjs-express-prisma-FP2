import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions/http.exception';
export const ErrorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.path.includes('/api/')) {
      const status: number = error.status || 500;
      const message: string = error.message || 'Something went wrong';

      res.status(status).json({ message });
    } else {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
