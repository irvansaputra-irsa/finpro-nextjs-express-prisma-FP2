import 'reflect-metadata';
import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import { AddressRouter } from './routers/address.router';
import { SampleRouter } from './routers/sample.router';
import { ProductCategoryRouter } from './routers/productCategory.router';
import { CartRouter } from './routers/cart.router';
import { CartItemRouter } from './routers/cartItem.router';
import { RajaOngkirRouter } from './routers/rajaOngkir.router';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { ProductRouter } from './routers/product.router';
import { AuthRouter } from './routers/auth.router';
import { StockRouter } from './routers/stock.router';
import { UploadRouter } from './routers/uploadTransaction.router';
import path from 'path';
import { WarehouseRouter } from './routers/warehouse.router';
import { MutationRouter } from './routers/mutation.router';
import { TransactionRouter } from './routers/transaction.router';
import { ReportRouter } from './routers/report.router';

import { CronJob } from 'cron';
import fetch from 'node-fetch';

require('dotenv').config();

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
    this.startCronJob();
  }

  private configure(): void {
    this.app.use(
      cors({
        origin: true,
        credentials: true,
      }),
    );
    this.app.use(json());
    this.app.use('/images', express.static(path.join(__dirname, 'public')));
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });
    this.app.use(ErrorMiddleware);
  }

  private routes(): void {
    const sampleRouter = new SampleRouter();
    const productCategoryRouter = new ProductCategoryRouter();
    const productRouter = new ProductRouter();
    const addToCartRouter = new CartRouter();
    const addressRouter = new AddressRouter();
    const cartItemRouter = new CartItemRouter();
    const authRouter = new AuthRouter();
    const rajaOngkirRouter = new RajaOngkirRouter();
    const stockRouter = new StockRouter();
    const uploadRouter = new UploadRouter();
    const warehouseRouter = new WarehouseRouter();
    const mutationRouter = new MutationRouter();
    const transactionRouter = new TransactionRouter();
    const reportRouter = new ReportRouter();

    this.app.get('/', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student !`);
    });

    this.app.use('/api/samples', sampleRouter.getRouter());

    this.app.use('/api/product-category', productCategoryRouter.getRouter());
    this.app.use('/api/product', productRouter.getRouter());
    this.app.use('/api/cart', addToCartRouter.getRouter());
    this.app.use('/api/address', addressRouter.getRouter());
    this.app.use('/api/cart-item', cartItemRouter.getRouter());
    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/raja-ongkir', rajaOngkirRouter.getRouter());
    this.app.use('/api/stock', stockRouter.getRouter());
    this.app.use('/api', uploadRouter.getRouter());
    this.app.use('/api/warehouse', warehouseRouter.getRouter());
    this.app.use('/api/mutation', mutationRouter.getRouter());
    this.app.use('/api/transaction', transactionRouter.getRouter());
    this.app.use('/api/report', reportRouter.getRouter());
  }

  private startCronJob(): void {
    const job = new CronJob(
      '0 * * * * *',
      async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/cron`,
            {
              method: 'POST',
            },
          );
          const message = await response.json();
          console.log(message);
        } catch (e) {
          console.error(e);
        }
      },
      null,
      true,
      'Asia/Jakarta',
    );
    job.start();
    console.log('CRON RUNNING...');
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
