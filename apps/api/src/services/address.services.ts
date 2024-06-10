import Container, { Service } from 'typedi';
import { AddressQuery } from '@/queries/address.queries';
import { getDefaultAddress } from '@/interfaces/getDefaultAddress.interface';
import { getAllAddress } from '@/interfaces/getAllAddress.interfaces';
import { Address } from '@prisma/client';

@Service()
export class AddressService {
  addressQueries = Container.get(AddressQuery);

  public getDefaultAddressService = async (
    param: getDefaultAddress,
  ): Promise<Address> => {
    try {
      const data = await this.addressQueries.getDefaultAddressQuery(param);

      return data;
    } catch (error) {
      throw error;
    }
  };

  public getAllAddressService = async (
    param: getAllAddress,
  ): Promise<Address[]> => {
    try {
      const data = await this.addressQueries.getAllAddressQuery(param);

      return data;
    } catch (error) {
      throw error;
    }
  };
}
