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
        _warehouse?.toString(),
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
      const user = req.user;
      const { _warehouse, _month } = req.query;
      const queryWarehouse = _warehouse?.toString() || null;
      const queryMonth = _month?.toString() || null;

      const data = await this.reportQuery.topSellingProduct(
        user,
        queryWarehouse,
        queryMonth,
      );

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
      const user = req.user;
      const { _warehouse, _month, _product, _category, _page, _limit } =
        req.query;
      const queryWarehouse = _warehouse?.toString() || null;
      const queryMonth = _month?.toString() || null;
      const queryProduct = _product?.toString() || null;
      const queryCategory = _category?.toString() || null;
      const queryPage = Number(_page) || null;
      const queryLimit = Number(_limit) || null;
      const data = await this.reportQuery.getTransactionReportList(
        user,
        queryWarehouse,
        queryMonth,
        queryProduct,
        queryCategory,
        queryPage,
        queryLimit,
      );

      return res
        .status(200)
        .json({ message: 'get all transaction report list success', data });
    } catch (error) {
      next(error);
    }
  };

  public getOverviewStockReport = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      const { _warehouse, _month, _product, _category, _page, _limit } =
        req.query;
      const queryMonth = _month?.toString() || null;
      const queryWarehouse = _warehouse?.toString() || null;

      const data = await this.reportQuery.getOverviewStockReport(
        user,
        queryMonth,
        queryWarehouse,
      );

      return res
        .status(200)
        .json({ message: 'get stock overview success', data });
    } catch (error) {
      next(error);
    }
  };
  public getStockReportList = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      const { _warehouse, _month, _page, _limit } = req.query;
      const queryMonth = _month?.toString() || null;
      const queryWarehouse = _warehouse?.toString() || null;
      const page = Number(_page) || null;
      const limit = Number(_limit) || 8;

      const data = await this.reportQuery.getStockReportList(
        user,
        queryMonth,
        queryWarehouse,
        page,
        limit,
      );

      return res
        .status(200)
        .json({ message: 'get stock reports success', data });
    } catch (error) {
      next(error);
    }
  };
}
