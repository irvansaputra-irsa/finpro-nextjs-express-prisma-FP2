import { Router } from 'express';
import { RajaOngkirController } from '@/controllers/rajaOngkir.controller';

export class RajaOngkirRouter {
  private router: Router;
  private rajaOngkirController: RajaOngkirController;

  constructor() {
    this.rajaOngkirController = new RajaOngkirController();
    this.router = Router();
    this.initializeRouter();
  }

  private initializeRouter(): void {
    this.router.post('/city-id', this.rajaOngkirController.getCityIdController);
  }

  getRouter(): Router {
    return this.router;
  }
}
