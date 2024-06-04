import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { ProductCategoryService } from '@/services/productCategory.services';
import { HttpException } from '@/exceptions/http.exception';

export class ProductCategoryController {
  productController = Container.get(ProductCategoryService);

  public createProductCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const param = req.body;
      const data =
        await this.productController.createProductCategoryService(param);

      res.status(201).json({
        message: 'Create New Product Category Success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
