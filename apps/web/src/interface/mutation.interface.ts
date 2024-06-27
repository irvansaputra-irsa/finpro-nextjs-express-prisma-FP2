import { product } from './product.interface';
import { warehouse } from './warehouse.interface';

export interface Imutation {
  id: number;
  from_warehouse_id: number;
  to_warehouse_id: number;
  sender_name: string;
  receiver_name: string | null;
  book_id: number;
  quantity: number;
  status: 'PROCESSED' | 'COMPLETED' | 'REJECTED' | 'CANCELED';
  sender_notes: string;
  receiver_notes: string;
  created_at: Date;
  updated_at: Date;
  from_warehouse?: warehouse;
  to_warehouse?: warehouse;
  book: product;
}
