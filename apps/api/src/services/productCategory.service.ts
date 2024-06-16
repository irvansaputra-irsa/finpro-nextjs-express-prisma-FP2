import { productCategory } from '@/interfaces/productCategory.interface';
import { ProductCategoryQuery } from '@/queries/productCategory.query';
import { BookCategory } from '@prisma/client';
import Container, { Service } from 'typedi';

@Service()
export class ProductCategoryService {
  productCategoryQueries = Container.get(ProductCategoryQuery);

  public createProductCategoryService = async (
    param: productCategory,
  ): Promise<BookCategory> => {
    try {
      const data =
        await this.productCategoryQueries.createProductCategoryQuery(param);

      return data;
    } catch (error) {
      throw error;
    }
  };

  public getProductCategoriesService = async (): Promise<BookCategory[]> => {
    try {
      const data =
        await this.productCategoryQueries.getProductCategoriesQuery();

      return data;
    } catch (error) {
      throw error;
    }
  };

  public getProductCategoryService = async (
    id: number,
  ): Promise<BookCategory> => {
    try {
      const data =
        await this.productCategoryQueries.getProductCategoryQuery(id);

      return data;
    } catch (error) {
      throw error;
    }
  };

  public updateProductCategoryService = async (
    param: productCategory,
  ): Promise<BookCategory> => {
    try {
      //check category availability first
      const check = await this.productCategoryQueries.getProductCategoryQuery(
        param.bookCategoryId,
      );
      if (!check) throw new Error('Category is not found');

      const data =
        await this.productCategoryQueries.updateProductCategoryQuery(param);

      return data;
    } catch (error) {
      throw error;
    }
  };
  public deleteProductCategoryService = async (
    id: number,
  ): Promise<BookCategory> => {
    try {
      const check =
        await this.productCategoryQueries.checkCategoryOnProduct(id);
      if (check) throw new Error('This category already used on book product');

      const data =
        await this.productCategoryQueries.deleteProductCategoryQuery(id);

      return data;
    } catch (error) {
      throw error;
    }
  };
}
