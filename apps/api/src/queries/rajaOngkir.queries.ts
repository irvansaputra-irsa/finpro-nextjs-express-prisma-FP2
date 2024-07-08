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

      const data = await prisma.rajaOngkir.findFirst({
        where: {
          city_name: cityName,
        },
      });
      if (!data) throw new Error('city is not valid');
      return data.city_id;
    } catch (error) {
      throw error;
    }
  };
}
