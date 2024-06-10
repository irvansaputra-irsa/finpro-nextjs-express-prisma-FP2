import prisma from '@/prisma';
import { Prisma, User } from '@prisma/client';
import { Service } from 'typedi';

@Service()
export class UserQuery {
  public checkUser = async (user_email: string): Promise<User> => {
    try {
      const data = await prisma.user.findUnique({
        where: {
          user_email,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
}
