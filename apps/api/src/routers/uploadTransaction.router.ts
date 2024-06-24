import { Router } from 'express';
import { Container } from 'typedi';
import { UploadController } from '@/controllers/uploadTransaction.controller';

export class UploadRouter {
  private router: Router;
  private uploadController: UploadController;

  constructor() {
    this.uploadController = Container.get(UploadController);
    this.router = Router();
    this.initializeRouter();
  }

  private initializeRouter(): void {
    this.router.post('/upload', this.uploadController.uploadFile);
  }

  getRouter(): Router {
    return this.router;
  }
}
