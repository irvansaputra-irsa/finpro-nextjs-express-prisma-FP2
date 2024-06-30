export interface reqMutation {
  receiverWarehouseId: number;
  senderWarehouseId: number;
  bookId: number;
  qty: number;
  senderName: string;
  senderNotes: string;
}

export interface respMutation {
  id: number;
  receiverName: string;
  receiverNotes: string;
}

export interface getMutation {
  id: number;
  pageIncoming: number;
  pageOutcoming: number;
  limit: number;
}

export interface plusStock {
  warehouseId: number;
  warehouseName: string;
  bookId: number;
  plus: number;
}
export interface minusStock {
  warehouseId: number;
  warehouseName: string;
  bookId: number;
  minus: number;
}
