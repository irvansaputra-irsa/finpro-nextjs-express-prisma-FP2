import { Router } from 'express';
import { AddressController } from '@/controllers/address.controller';

export class AddressRouter {
  private router: Router;
  private addressController: AddressController;

  constructor() {
    this.addressController = new AddressController();
    this.router = Router();
    this.initializeRouter();
  }

  private initializeRouter(): void {
    this.router.post('/default', this.addressController.getDefaultController);
    this.router.post('/all', this.addressController.getAllController);
  }

  getRouter(): Router {
    return this.router;
  }
}
