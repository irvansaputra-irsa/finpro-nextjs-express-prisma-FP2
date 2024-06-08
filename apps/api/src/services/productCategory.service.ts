import { productCategory } from '@/interfaces/productCategory.interface';
import { ProductCategoryQuery } from '@/queries/productCategory.query';
import { BookCategory } from '@prisma/client';
import Container, { Service } from 'typedi';

@Service()
export class ProductCategoryService {
  productQueries = Container.get(ProductCategoryQuery);

  public createProductCategoryService = async (
    param: productCategory,
  ): Promise<BookCategory> => {
    try {
      const data = await this.productQueries.createProductCategoryQuery(param);

      return data;
    } catch (error) {
      throw error;
    }
  };

  public getProductCategoriesService = async (): Promise<BookCategory[]> => {
    try {
      const data = await this.productQueries.getProductCategoriesQuery();

      return data;
    } catch (error) {
      throw error;
    }
  };

  public getProductCategoryService = async (
    id: number,
  ): Promise<BookCategory> => {
    try {
      const data = await this.productQueries.getProductCategoryQuery(id);

      return data;
    } catch (error) {
      throw error;
    }
  };

  public updateProductCategoryService = async (
    param: productCategory,
    id: number,
  ): Promise<BookCategory> => {
    try {
      //check category availability first
      const check = await this.productQueries.getProductCategoryQuery(id);
      if (!check) throw new Error('Category is not found');

      const data = await this.productQueries.updateProductCategoryQuery(
        param,
        id,
      );

      return data;
    } catch (error) {
      throw error;
    }
  };
  public deleteProductCategoryService = async (
    id: number,
  ): Promise<BookCategory> => {
    try {
      const data = await this.productQueries.deleteProductCategoryQuery(id);

      return data;
    } catch (error) {
      throw error;
    }
  };
}
