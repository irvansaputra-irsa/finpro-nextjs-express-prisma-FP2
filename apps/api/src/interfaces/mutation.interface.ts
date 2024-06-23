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
