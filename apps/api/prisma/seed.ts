import { PrismaClient } from '@prisma/client';
import users from './data/users.json';
import { genSalt, hash } from 'bcrypt';

const prisma = new PrismaClient();

const seedUsers = async () => {
  console.log('--- Start seeding users data ---');

  await prisma.user.deleteMany();
  for (const user of users) {
    const salt = await genSalt(10);
    const hashPassword = await hash(user.password, salt);

    await prisma.user.create({
      data: {
        user_name: user.name,
        user_email: user.email,
        user_password: hashPassword,
        is_verified: true,
        role: user.role,
      },
    });

    console.log('Created user', user.name);
  }

  console.log('Seeding users data finished');
};

const main = async () => {
  await seedUsers();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
