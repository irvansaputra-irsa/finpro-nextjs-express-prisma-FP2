import prisma from '@/prisma';

export class ReportQuery {
  public sumSalesPerMonth = async () => {
    try {
      const data = await prisma.transaction.aggregate({});
    } catch (error) {
      throw error;
    }
  };
}
