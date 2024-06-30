import { MutationController } from '@/controllers/mutation.controller';
import { Router } from 'express';

export class MutationRouter {
  private router: Router;
  private mutationController: MutationController;

  constructor() {
    this.mutationController = new MutationController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      this.mutationController.requestMutationProductController,
    );
    this.router.post(
      '/accepted',
      this.mutationController.acceptMutationController,
    );
    this.router.post(
      '/rejected',
      this.mutationController.rejectMutationController,
    );
    this.router.post(
      '/canceled',
      this.mutationController.cancelMutationController,
    );
    this.router.get(
      '/',
      this.mutationController.getWarehouseMutationController,
    );
    this.router.post(
      '/nearest',
      this.mutationController.findNearestWarehouseController,
    );
    this.router.post(
      '/distribute',
      this.mutationController.distributeMutationStockController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
