import { product } from './product.interface';
import { warehouse } from './warehouse.interface';

export interface IaddStock {
  id: number;
  stockAddition: number;
}
export interface IremoveStock {
  id: number;
  stockSubtraction: number;
}

export interface productStock {
  id: number;
  book_id: number;
  stockQty: number;
  warehouse_id: number;
  book: product;
  warehouse: warehouse;
  created_at: Date;
  updated_at: Date;
}
