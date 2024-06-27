import Container, { Service } from 'typedi';
import { CartQuery } from '@/queries/cart.queries';
import { getAliveCart } from '@/interfaces/getAliveCart.interfaces';
import { allCartItem } from '@/interfaces/allCartItem.interfaces';

@Service()
export class CartService {
  cartQueries = Container.get(CartQuery);

  public getAliveCartService = async (param: getAliveCart): Promise<number> => {
    try {
      const data = await this.cartQueries.getAliveCartQuery(param);

      return data;
    } catch (error) {
      throw error;
    }
  };

  public checkStock = async (cartId: number): Promise<boolean> => {
    try {
      const data = await this.cartQueries.checkStock(cartId);

      return data;
    } catch (error) {
      throw error;
    }
  };
}
