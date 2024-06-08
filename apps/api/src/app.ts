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
import { SampleRouter } from './routers/sample.router';
import { ProductCategoryRouter } from './routers/productCategory.router';
import { CartRouter } from './routers/cart.router';
import { ErrorMiddleware } from './middlewares/error.middleware';
import express, { Application } from 'express';
import { API_PORT } from './config';

import authRouter from './routes/auth.route';
// import userRouter from './routes/user.route';
import { ErrorMiddleware } from './middlewares/error.middleware';
import cors from 'cors';

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
    const addToCartRouter = new CartRouter();

    this.app.get('/', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student !`);
    });

    this.app.use('/api/samples', sampleRouter.getRouter());

    this.app.use('/api/product-category', productCategoryRouter.getRouter());
    this.app.use('/api/cart', addToCartRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}



class Server {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = Number(API_PORT) || 8000;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private initializeRoutes(): void {
    this.app.use('/auth', authRouter);
    // this.app.use('/users', userRouter);
  }

  private initializeErrorHandling(): void {
    this.app.use(ErrorMiddleware);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });
  }
}

const server = new Server();
server.listen();
``
