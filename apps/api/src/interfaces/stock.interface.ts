import { Warehouse, WarehouseStock } from '@prisma/client';

export interface warehouseStock {
  bookId: number;
  warehouseId: number;
  qty: number;
}

export interface updateStock extends warehouseStock {
  id: number;
}

export interface addStock {
  id: number;
  stockAddition: number;
}

export interface removeStock {
  id: number;
  stockSubtraction: number;
}

export interface updateStockMutation {
  senderWarehouseId: number;
  receiverWarehouseId: number;
  bookId: number;
  qty: number;
}

export interface WarehouseStockWithWarehouse extends WarehouseStock {
  warehouse: Warehouse; // Include Warehouse relation
}
