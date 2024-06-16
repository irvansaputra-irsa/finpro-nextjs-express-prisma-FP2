import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { ProductCategoryService } from '@/services/productCategory.service';

export class ProductCategoryController {
  categoryController = Container.get(ProductCategoryService);

  public createProductCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const param = req.body;
      const data =
        await this.categoryController.createProductCategoryService(param);

      res.status(201).json({
        message: 'Create New Product Category Success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getProductCategoriesController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.categoryController.getProductCategoriesService();

      res.status(200).json({
        message: 'Get All Product Categories Success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getProductCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.categoryController.getProductCategoryService(
        Number(id),
      );

      res.status(200).json({
        message: 'Get Product Category Success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateProductCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const param = req.body;
      const data =
        await this.categoryController.updateProductCategoryService(param);

      res.status(200).json({
        message: 'Update Product Category Success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteProductCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.categoryController.deleteProductCategoryService(
        Number(id),
      );

      res.status(200).json({
        message: 'Delete Product Category Success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
