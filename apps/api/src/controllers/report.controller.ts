import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { ReportQuery } from '@/queries/report.query';

export class ReportController {
  reportQuery = Container.get(ReportQuery);
  public sumSalesRevenuePerMonth = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { _category, _product, _warehouse } = req.query;
      const user = req.user;
      const data = await this.reportQuery.sumSalesRevenuePerMonth(
        _category?.toString(),
        _product?.toString(),
        Number(_warehouse),
        user,
      );

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public topSellingProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { filterCategory, filterProduct } = req.body;
      const data = await this.reportQuery.topSellingProduct();

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public getTransactionReportList = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.reportQuery.getTransactionReportList();

      return res
        .status(200)
        .json({ message: 'get all transaction report list success', data });
    } catch (error) {
      next(error);
    }
  };
}
