import { Request, Response } from 'express';
import Container from 'typedi';
import { ReportQuery } from '@/queries/report.query';

export class ReportController {
  reportQuery = Container.get(ReportQuery);
  public sumSalesRevenuePerMonth = async (req: Request, res: Response) => {
    const { filterCategory, filterProduct } = req.body;
    const data = await this.reportQuery.sumSalesRevenuePerMonth(
      filterCategory,
      filterProduct,
    );

    return res.status(200).json(data);
  };

  public topSellingProduct = async (req: Request, res: Response) => {
    const { filterCategory, filterProduct } = req.body;
    const data = await this.reportQuery.topSellingProduct();

    return res.status(200).json(data);
  };
}
