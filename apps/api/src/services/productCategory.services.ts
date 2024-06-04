import { productCategory } from '@/interfaces/productCategory.interfaces';
import { ProductCategoryQuery } from '@/queries/productCategory.queries';
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
}
