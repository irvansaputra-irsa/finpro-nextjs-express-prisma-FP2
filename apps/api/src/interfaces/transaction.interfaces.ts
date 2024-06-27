export interface CreateTransaction {
  status: string;
  payment_method: string;
  payment_proof: string;
  confirmation_date: Date;
  final_price: number;
  destination_id: number;
  warehouse_id: number;
  cart_id: number;
}
