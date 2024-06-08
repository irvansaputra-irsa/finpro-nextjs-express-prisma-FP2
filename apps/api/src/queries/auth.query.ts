import { PrismaClient } from '@prisma/client';
import { User } from '@prisma/client';
import { Auth } from '../interfaces/auth.interface';
import { transporter } from '../helpers/nodemailer';
import * as handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

const registerQuery = async (data: User, pass: string): Promise<User> => {
  try {
    const t = await prisma.$transaction(async (prisma) => {
      try {
        const user = await prisma.user.create({
          data: {
            user_email: data.user_email,
            user_password: pass,
            role: 'string',
          },
        });
        // const pathOldImage = path.join(__dirname, "../public", avatar)
        // fs.unlinkSync(pathOldImage);

        const templatePath = path.join(
          __dirname,
          '../templates',
          'registrationEmail.hbs',
        );
        const token = 'asdasd';
        const urlVerify = `http://localhost:3000/verify?token=${token}`;
        const templateSource = fs.readFileSync(templatePath, 'utf-8');

        const compiledTemplate = handlebars.compile(templateSource);
        const html = compiledTemplate({
          user_email: true,
          url: urlVerify,
        });

        await transporter.sendMail({
          from: 'sender address',
          to: user.user_email || '',
          subject: 'welcome to tokopedya',
          html,
        });

        return user;
      } catch (err) {
        throw err;
      }
    });
    return t;
  } catch (err) {
    throw err;
  }
};

const loginQuery = async (data: Auth) => {
  try {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        user_email: true,
        role: true,
      },
      where: { user_email: data.email, user_password: data.password },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

export { registerQuery, loginQuery };
