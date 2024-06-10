import prisma from '@/prisma';
import { Service } from 'typedi';
import { GetBookNameQuery } from '@/interfaces/getBookNameQuery.interfaces';

@Service()
export class BookQuery {
  public getNameQuery = async (param: GetBookNameQuery): Promise<string> => {
    try {
      const { bookId } = param;
      const data = await prisma.book.findUnique({
        select: {
          book_name: true,
        },
        where: {
          id: bookId,
        },
      });

      return data.book_name;
    } catch (error) {
      throw error;
    }
  };
}
