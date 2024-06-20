import prisma from '@/prisma';
import { Service } from 'typedi';
import { Address } from '@prisma/client';
import { getDefaultAddress } from '@/interfaces/getDefaultAddress.interface';
import { getAllAddress } from '@/interfaces/getAllAddress.interfaces';

@Service()
export class AddressQuery {
  public getDefaultAddressQuery = async (
    param: getDefaultAddress,
  ): Promise<Address> => {
    try {
      const { userId } = param;
      const data = await prisma.address.findFirst({
        where: {
          user_id: userId,
        },
        orderBy: [
          {
            id: 'asc',
          },
        ],
      });

      return data;
    } catch (error) {
      throw error;
    }
  };

  public getAllAddressQuery = async (
    param: getAllAddress,
  ): Promise<Address[]> => {
    try {
      const { userId } = param;
      const data = await prisma.address.findMany({
        where: {
          user_id: Number(userId),
        },
        orderBy: [
          {
            id: 'asc',
          },
        ],
      });

      return data;
    } catch (error) {
      throw error;
    }
  };
}
