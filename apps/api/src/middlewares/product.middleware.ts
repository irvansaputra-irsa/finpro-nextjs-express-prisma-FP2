import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions/http.exception';
import { ProductQuery } from '@/queries/product.query';
import Container from 'typedi';

export class ProductMiddleware {
  public productQuery = Container.get(ProductQuery);
  public isProductNameExist = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const name = req.header('BookName');
      const check = await this.productQuery.checkProduct('name', name);
      if (check) throw new HttpException(400, 'Book name already existed');
      next();
    } catch (error) {
      next(error);
    }
  };
  public isProductNameExistUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const name = req.header('BookName');
      const id = req.header('BookId');
      const check = await this.productQuery.checkProductForUpdate(
        Number(id),
        name,
      );
      if (check)
        throw new HttpException(
          400,
          'Book name already existed, Please choose another name',
        );
      next();
    } catch (error) {
      next(error);
    }
  };
}
