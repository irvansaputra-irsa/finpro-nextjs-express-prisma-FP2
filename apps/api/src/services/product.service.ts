import { HttpException } from '@/exceptions/http.exception';
import { product } from '@/interfaces/product.interface';
import { ProductQuery } from '@/queries/product.query';
import { User } from '@/types/express';
import { deleteHypeninString } from '@/utils/convert.utils';
import { Book } from '@prisma/client';
import Container, { Service } from 'typedi';

@Service()
export class ProductService {
  public productQuery = Container.get(ProductQuery);
  public createProductService = async (
    params: product,
    files: Express.Multer.File[],
    user: User,
  ) => {
    try {
      if (user?.role.toLowerCase() !== 'super admin') {
        throw new HttpException(403, 'Unauthorized');
      }
      const data = await this.productQuery.createProductQuery(params, files);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public deleteProductService = async (id: number, user: User) => {
    try {
      if (user?.role.toLowerCase() !== 'super admin') {
        throw new HttpException(403, 'Unauthorized');
      }
      const check = await this.productQuery.checkProduct('id', id);
      if (!check) throw new Error('Product is not exist');

      const data = await this.productQuery.deleteProductQuery(id);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public getAllProductsService = async (
    page: number,
    limit: number,
    category: string,
    sortBy: string,
    search: string,
  ) => {
    try {
      if (category.includes('-')) {
        category = deleteHypeninString(category);
      }
      const data = await this.productQuery.getAllProductsQuery(
        page,
        limit,
        category,
        sortBy,
        search,
      );
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
    user: User,
  ) => {
    try {
      if (user?.role.toLowerCase() !== 'super admin') {
        throw new HttpException(403, 'Unauthorized');
      }
      const data = await this.productQuery.updateProductQuery(param, files);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public deleteProductImageService = async (id: number) => {
    try {
      const data = await this.productQuery.deleteProductImageQuery(id);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public getAllProductsDashboardService = async (
    page: number,
    limit: number,
    category: string,
    sortBy: string,
    search: string,
    order: string,
  ) => {
    try {
      if (category.includes('-')) {
        category = deleteHypeninString(category);
      }
      const data = await this.productQuery.getAllProductsDashboardQuery(
        page,
        limit,
        category,
        sortBy,
        search,
        order,
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  public getListProductNameService = async () => {
    try {
      const listProduct = await this.productQuery.getListProductNameQuery();
      return listProduct;
    } catch (error) {
      throw error;
    }
  };
}
