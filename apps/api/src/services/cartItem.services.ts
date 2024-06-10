import { CartItem } from '@prisma/client';
import { CartItemQuery } from '@/queries/cartItem.queries';
import Container, { Service } from 'typedi';
import { checkCartItem } from '@/interfaces/checkCartItem.interfaces';
import { createCartItem } from '@/interfaces/createCartItem.interfaces';
import { addCartItem } from '@/interfaces/addCart.interfaces';
import { updateCartItem } from '@/interfaces/updateCartItem.interfaces';
import { allCartItem } from '@/interfaces/allCartItem.interfaces';

@Service()
export class CartItemService {
  cartItemQueries = Container.get(CartItemQuery);

  public checkCartItemExistService = async (
    param: checkCartItem,
  ): Promise<number> => {
    try {
      const data = await this.cartItemQueries.checkCartItemExistQuery(param);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public createNewCartItemService = async (
    param: createCartItem,
  ): Promise<number> => {
    try {
      const data = await this.cartItemQueries.createNewCartItemQuery(param);
      return data;
    } catch (error) {
      throw error;
    }
  };

  public addCartItemService = async (param: addCartItem): Promise<void> => {
    try {
      await this.cartItemQueries.addCartItemQuery(param);
    } catch (error) {
      throw error;
    }
  };

  public updateCartItemService = async (
    param: updateCartItem,
  ): Promise<void> => {
    try {
      await this.cartItemQueries.updateCartItemQuery(param);
    } catch (error) {
      throw error;
    }
  };

  public allCartItemService = async (
    param: allCartItem,
  ): Promise<CartItem[]> => {
    try {
      const data = await this.cartItemQueries.allCartItemQuery(param);
      return data;
    } catch (error) {
      throw error;
    }
  };
}
