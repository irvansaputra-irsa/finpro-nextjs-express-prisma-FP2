import { mutationJurnal } from '@/interfaces/jurnal.interfaces';
import prisma from '@/prisma';
import { Service } from 'typedi';

@Service()
export class JurnalQuery {
  public insertMutationJurnalQuery = async (jurnalData: mutationJurnal) => {
    try {
      const {
        receiverInvent,
        latestReceiverStock,
        senderInvent,
        latestSenderStock,
        qty,
      } = jurnalData;
      //1. validasi kedua warehousenya
      const checkWarehouseSender = await prisma.warehouse.findFirst({
        where: {
          id: senderInvent.warehouse_id,
        },
      });
      const checkWarehouseReceiver = await prisma.warehouse.findFirst({
        where: {
          id: receiverInvent.warehouse_id,
        },
      });
      if (!checkWarehouseReceiver && !checkWarehouseSender) {
        throw new Error('Warehouse is not exist');
      }
      //2. update jurnal pengeluaran
      const receiverJurnal = await prisma.jurnalStock.create({
        data: {
          warehouseStockId: receiverInvent.id,
          oldStock: latestReceiverStock + qty,
          newStock: latestReceiverStock,
          stockChange: qty,
          type: 'MINUS',
          message: `${qty} books out to warehouse ${checkWarehouseSender.warehouse_name}`,
        },
      });
      //3. update jurnal pemasukan
      const senderJurnal = await prisma.jurnalStock.create({
        data: {
          warehouseStockId: senderInvent.id,
          oldStock: latestSenderStock - qty,
          newStock: latestSenderStock,
          stockChange: qty,
          type: 'PLUS',
          message: `${qty} books in from warehouse ${checkWarehouseReceiver.warehouse_name}`,
        },
      });
    } catch (error) {
      throw error;
    }
  };
}
