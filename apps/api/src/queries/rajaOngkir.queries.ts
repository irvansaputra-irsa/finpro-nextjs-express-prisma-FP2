import prisma from '@/prisma';
import { Service } from 'typedi';
import { GetCityIdInterface } from '@/interfaces/getCityId.interfaces';

@Service()
export class RajaOngkirQuery {
  public getCityIdQuery = async (
    param: GetCityIdInterface,
  ): Promise<number> => {
    try {
      const { cityName } = param;
      console.log('TEST', cityName);
      const data = await prisma.rajaOngkir.findFirst({
        where: {
          city_name: cityName,
        },
      });

      console.log(data);

      return data.city_id;
    } catch (error) {
      throw error;
    }
  };
}
