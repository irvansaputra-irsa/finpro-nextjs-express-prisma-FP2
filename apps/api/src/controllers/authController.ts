import { AuthService } from '@/services/auth.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class AuthController {
  authService = Container.get(AuthService);
  public registerController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const param = req.body;
      const data = await this.authService.registerService(param);
      res.status(201).json({
        message: 'Register Success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userEmail, userPassword } = req.body;
      const data = await this.authService.verifyService(
        userEmail,
        userPassword,
      );
      res.status(201).json({
        message: 'Password has set and user successfully verified',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public loginController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userEmail, userPassword } = req.body;
      const data = await this.authService.loginService(userEmail, userPassword);
      res.status(200).json({
        message: 'Login Success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
