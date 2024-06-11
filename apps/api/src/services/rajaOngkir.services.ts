import Container, { Service } from 'typedi';
import { RajaOngkirQuery } from '@/queries/rajaOngkir.queries';
import { GetCityIdInterface } from '@/interfaces/getCityId.interfaces';

@Service()
export class RajaOngkirService {
  rajaOngkirQueries = Container.get(RajaOngkirQuery);

  public getCityIdService = async (
    param: GetCityIdInterface,
  ): Promise<number> => {
    try {
      const cityName = param.cityName;
      console.log('param: ', param, ' cityName: ', cityName);
      const data = await this.rajaOngkirQueries.getCityIdQuery({ cityName });

      return data;
    } catch (error) {
      throw error;
    }
  };
}
