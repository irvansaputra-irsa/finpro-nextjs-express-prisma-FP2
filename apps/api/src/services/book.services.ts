import Container, { Service } from 'typedi';
import { BookQuery } from '@/queries/book.queries';
import { GetBookNameQuery } from '@/interfaces/getBookNameQuery.interfaces';

@Service()
export class BookService {
  bookQueries = Container.get(BookQuery);

  public getNameService = async (param: GetBookNameQuery): Promise<string> => {
    try {
      const data = await this.bookQueries.getNameQuery(param);
      return data;
    } catch (error) {
      throw error;
    }
  };
}
