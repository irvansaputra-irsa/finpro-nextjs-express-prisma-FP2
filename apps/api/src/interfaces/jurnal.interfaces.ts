import { WarehouseStock } from '@prisma/client';
import { warehouseStock } from './stock.interface';

export interface jurnal {
  warehouseStockId: number;
  oldStock: number;
  newStock: number;
  stockChange: number;
  type: 'PLUS' | 'MINUS';
  message: string;
}

export interface mutationJurnal {
  receiverInvent: WarehouseStock;
  latestReceiverStock: number;
  senderInvent: WarehouseStock;
  latestSenderStock: number;
  qty: number;
}
