import { Book } from '@prisma/client';

export interface IfetchProductNotAddedYet {
  products: Book[];
  totalPage: number;
}
