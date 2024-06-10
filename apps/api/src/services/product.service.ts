import { HttpException } from '@/exceptions/http.exception';
import { product } from '@/interfaces/product.interface';
import { ProductQuery } from '@/queries/product.query';
import { Book } from '@prisma/client';
import Container, { Service } from 'typedi';

@Service()
export class ProductService {
  public productQuery = Container.get(ProductQuery);
  public createProductService = async (
    params: product,
    files: Express.Multer.File[],
  ) => {
    try {
      const data = await this.productQuery.createProductQuery(params, files);

      return data;
    } catch (error) {
      throw error;
    }
  };

  public deleteProductService = async (id: number) => {
    try {
      const check = await this.productQuery.checkProduct('id', id);
      if (!check) throw new Error('Product is not exist');

      const data = await this.productQuery.deleteProductQuery(id);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public getAllProductsService = async () => {
    try {
      const data = await this.productQuery.getAllProductsQuery();
      return data;
    } catch (error) {
      throw error;
    }
  };

  public getProductService = async (name: string) => {
    try {
      const splitName = name.replace('-', ' ');
      const data = await this.productQuery.getProductQuery(splitName);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public updateProductService = async (
    param: Book,
    files: Express.Multer.File[],
  ) => {
    try {
      const data = await this.productQuery.updateProductQuery(param, files);
      return data;
    } catch (error) {
      throw error;
    }
  };
}
