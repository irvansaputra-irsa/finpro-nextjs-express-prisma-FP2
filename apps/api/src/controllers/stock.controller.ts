import { StockService } from '@/services/stock.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class StockController {
  stockService = Container.get(StockService);

  public addProductToWarehouseStockController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const param = { ...req.body, qty: 0 };
      const data =
        await this.stockService.addProductToWarehouseStockService(param);

      res.status(200).json({
        message: 'Add product to warehouse success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public addStockController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const param = req.body;
      const data = await this.stockService.addStockService(param);

      res.status(200).json({
        message: 'Add new warehouse stock success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
  public fetchAllProductAtSelectedWarehouseController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const data =
        await this.stockService.fetchAllProductAtSelectedWarehouseService(
          Number(id),
        );

      res.status(200).json({
        message: 'Fetch all warehouse stock success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
  public fetchProductNotAddedYetController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.stockService.fetchProductNotAddedYetService(
        Number(id),
      );

      res.status(200).json({
        message: 'Fetch all product success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}