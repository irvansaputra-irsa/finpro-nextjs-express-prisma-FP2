import { User } from 'prisma/prisma-client';
import { Auth } from '../interfaces/auth.interface';
import { getUserByEmailQuery } from '../queries/user.query';
import { loginQuery, registerQuery } from '../queries/auth.query';
// import { HttpException } from '../exceptions/HttpException';
import { genSalt, hash, compare } from 'bcrypt';
import { API_KEY } from '../config';
import { sign } from 'jsonwebtoken';

const registerAction = async (data: User): Promise<User> => {
  try {
    const check = await getUserByEmailQuery(data.email || '');

    if (check) throw new Error('user already exist');

    const salt = await genSalt(10);

    const hashPass = await hash(data.password || '', salt);

    const user = await registerQuery(data, hashPass);

    return user;
  } catch (err) {
    throw err;
  }
};

const loginAction = async (data: Auth) => {
  try {
    const user = await getUserByEmailQuery(data.email);

    if (!user) throw new Error(`email doesn't exist`);

    // if (data.password === user.password)

    const isValid = await compare(data.password, user.password || '');

    if (!isValid) {
      throw new Error('password is wrong');
    } else {
      console.log(`Welcome, ${user.email}`);
    }

    const payload = {
      userId: user.id,
      email: user.email,
    };
    const token = sign(payload, String(API_KEY), { expiresIn: '1h' });
    console.log(token);

    return { user, token };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { registerAction, loginAction };
