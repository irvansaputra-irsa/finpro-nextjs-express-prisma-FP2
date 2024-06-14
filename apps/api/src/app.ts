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
import path from 'path';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
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

    // error
    // this.app.use(
    //   (err: Error, req: Request, res: Response, next: NextFunction) => {
    //     if (req.path.includes('/api/')) {
    //       console.error('Error : ', err.stack);
    //       res.status(500).send('Error !');
    //     } else {
    //       next();
    //     }
    //   },
    // );
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
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
