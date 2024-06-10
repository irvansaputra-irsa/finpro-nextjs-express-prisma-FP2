import { API_KEY } from '@/config';
import { HttpException } from '@/exceptions/http.exception';
import { User } from '@/types/express';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export class AuthMiddleware {
  verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) throw new HttpException(500, 'Token invalid');

      const verifyUser = verify(token, String(API_KEY));
      if (!verifyUser) throw new HttpException(500, 'Unauthorized');

      req.user = verifyUser as User;

      next();
    } catch (err) {
      next(err);
    }
  };

  adminGuard = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (String(req.user?.role).toLowerCase() !== 'admin') {
        throw new HttpException(403, 'Forbidden Access');
      }
      next();
    } catch (error) {
      throw error;
    }
  };
}
