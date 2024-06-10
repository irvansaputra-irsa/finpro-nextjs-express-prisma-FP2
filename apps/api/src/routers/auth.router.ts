import { AuthController } from '@/controllers/authController';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class AuthRouter {
  private router: Router;
  private authController: AuthController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.authController = new AuthController();
    this.authMiddleware = new AuthMiddleware();
    this.router = Router();
    this.initializeRouter();
  }

  private initializeRouter(): void {
    this.router.post('/register', this.authController.registerController);
    this.router.post('/login', this.authController.loginController);
    this.router.post(
      '/verify',
      this.authMiddleware.verifyToken,
      this.authController.verifyController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
