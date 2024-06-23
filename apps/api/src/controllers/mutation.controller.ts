import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { MutationService } from '@/services/mutation.service';

export class MutationController {
  mutationService = Container.get(MutationService);
  public requestMutationProductController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const params = req.body;
      const data =
        await this.mutationService.requestMutationProductService(params);

      res.status(201).json({
        message: 'Mutation request successfully created',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public acceptMutationController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const params = req.body;
      const data = await this.mutationService.acceptMutationService(params);
      res.status(200).json({
        message: 'Mutation request has been accepted',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
  public rejectMutationController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const params = req.body;
      const data = await this.mutationService.rejectMutationService(params);
      res.status(200).json({
        message: 'Mutation request has been rejected',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
  public cancelMutationController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.body;
      const data = await this.mutationService.cancelMutationService(id);
      res.status(200).json({
        message: 'Mutation request has been canceled',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
  public getAllMutationController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.mutationService.getAllMutationService();
      res.status(200).json({
        message: 'Get all mutation success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
