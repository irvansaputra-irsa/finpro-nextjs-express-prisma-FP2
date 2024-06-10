import prisma from '@/prisma';
import { Service } from 'typedi';
import * as handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';
import { API_KEY, FE_URL } from '@/config';
import { transporter } from '@/helpers/nodemailer';
import { sign } from 'jsonwebtoken';
import { User } from '@prisma/client';

@Service()
export class AuthQuery {
  public registerQuery = async (param): Promise<User> => {
    try {
      const { userEmail } = param;

      const data = await prisma.user.create({
        data: {
          user_email: userEmail,
          role: 'user',
          is_verified: false,
        },
      });

      // send verification and let user set his password
      this.sendVerificationMail(data);

      return data;
    } catch (error) {
      throw error;
    }
  };

  public sendVerificationMail = async (param) => {
    try {
      const { user_email } = param;
      const payload = {
        userEmail: user_email,
      };
      const token = sign(payload, String(API_KEY), { expiresIn: '1hr' });

      const templatePath = path.join(
        __dirname,
        '../templates',
        'registrationEmail.hbs',
      );

      const urlVerify = `${FE_URL}/verify?token=${token}`;
      const templateText = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateText);
      const html = compiledTemplate({
        email: payload.userEmail,
        url: urlVerify,
      });

      await transporter.sendMail({
        from: 'sender address',
        to: payload.userEmail,
        subject: 'Welcome to Librairie',
        html,
      });
    } catch (error) {
      throw error;
    }
  };

  public verifyQuery = async (userEmail: string, hashedPass: string) => {
    try {
      const data = await prisma.user.update({
        data: {
          user_password: hashedPass,
          is_verified: true,
        },
        where: {
          user_email: userEmail,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
}
