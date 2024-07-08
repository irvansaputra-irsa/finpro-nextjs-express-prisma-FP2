import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';
import Container from 'typedi';
import { AddressService } from '@/services/address.services';

export class AddressController {
  addressController = Container.get(AddressService);

  public getDefaultController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req.body;
      const address = await this.addressController.getDefaultAddressService({
        userId,
      });

      const id = address === null ? '-' : address.id;
      const street = address === null ? '-' : address.street;
      const postal_code = address === null ? '-' : address.postal_code;
      const city = address === null ? '-' : address.city;
      const country = address === null ? '-' : address.country;
      const lat = address === null ? 0 : address.lat;
      const long = address === null ? 0 : address.long;

      res.status(200).json({
        id,
        street,
        postal_code,
        city,
        country,
        lat,
        long,
      });
    } catch (error) {
      throw error;
    }
  };

  public getAllController = async (
    req: Request,
    res: Response,
    mext: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req.body;
      const addressses = await this.addressController.getAllAddressService({
        userId,
      });

      res.status(200).json({
        addresses: addressses,
      });
    } catch (error) {
      throw error;
    }
  };
}
