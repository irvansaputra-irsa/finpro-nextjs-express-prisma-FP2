import { IUser } from '@/interfaces/user.interface';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getUserByEmailQuery = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      include: {
        role: true,
      },
      where: {
        email,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

// const updateUserQuery = async (id: string, data: IUser) => {
//   try {
//     const user = await prisma.user.update({
//       data: {
//         ...data,
//         birthDate: data.birthDate ? new Date(data.birthDate) : null,
//       },
//       where: {
//         id,
//       },
//     });

//     return user;
//   } catch (err) {
//     throw err;
//   }
// };

export { getUserByEmailQuery };
