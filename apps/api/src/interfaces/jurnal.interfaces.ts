export interface jurnal {
  warehouseStockId: number;
  oldStock: number;
  newStock: number;
  stockChange: number;
  type: 'Penambahan' | 'Pengurangan';
  message: string;
}
