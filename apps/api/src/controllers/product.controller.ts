import { ProductService } from '@/services/product.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class ProductController {
  public productService = Container.get(ProductService);
  public createProductController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const params = req.body;
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      if (Array.isArray(files)) {
        const data = await this.productService.createProductService(
          params,
          files,
        );
        res.status(201).json({
          message: 'Create New Product Success',
          data,
        });
      } else {
        throw new Error('Incorrect File Format');
      }
    } catch (error) {
      next(error);
    }
  };

  public deleteProductController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const data = await this.productService.deleteProductService(Number(id));
      res.status(200).json({
        message: 'Delete Product Success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllProductsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page, limit, category, sort, search } = req.query;
      let data = {};
      const pages = Number(page) || undefined;
      const limits = Number(limit) || undefined;
      const categories = category?.toString() || '';
      const sortBy = sort?.toString() || '';
      const searchs = search?.toString() || '';
      data = await this.productService.getAllProductsService(
        pages,
        limits,
        categories,
        sortBy,
        searchs,
      );

      res.status(200).json({
        message: 'Get All Product Success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getProductController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { bookName } = req.params;
      const data = await this.productService.getProductService(bookName);
      res.status(200).json({
        message: 'Get Product Detail Success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateProductController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const param = req.body;
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      if (Array.isArray(files)) {
        const data = await this.productService.updateProductService(
          param,
          files,
        );
        res.status(200).json({
          message: 'Update Product Detail Success',
          data,
        });
      } else {
        throw new Error('Incorrect File Format');
      }
    } catch (error) {
      next(error);
    }
  };

  public deleteProductImageController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const data = await this.productService.deleteProductImageService(
        Number(id),
      );
      res.status(200).json({
        message: 'Delete Product Image Success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllProductsDashboardController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page, limit, category, sort, search } = req.query;
      let data = {};
      const pages = Number(page) || undefined;
      const limits = Number(limit) || undefined;
      const categories = category?.toString() || '';
      const sortBy = sort?.toString() || '';
      const searchs = search?.toString() || '';
      data = await this.productService.getAllProductsDashboardService(
        pages,
        limits,
        categories,
        sortBy,
        searchs,
      );

      res.status(200).json({
        message: 'Get All Product Success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getListProductNameController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.productService.getListProductNameService();
      res.status(200).json({
        message: 'Get all products name success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
