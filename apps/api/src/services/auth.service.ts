import { AuthQuery } from '@/queries/auth.query';
import { UserQuery } from '@/queries/user.query';
import { generateJWT } from '@/utils/auth.utils';
import { compare, genSalt, hash } from 'bcrypt';
import Container, { Service } from 'typedi';

@Service()
export class AuthService {
  authQuery = Container.get(AuthQuery);
  userQuery = Container.get(UserQuery);
  public registerService = async (param) => {
    try {
      let data;
      const { userEmail } = param;
      //check if the email is existed
      const check = await this.userQuery.checkUser(userEmail);

      if (check) {
        if (check.is_verified) {
          throw new Error('This email already used');
        } else {
          this.authQuery.sendVerificationMail(check);
          data = check;
        }
      } else {
        data = this.authQuery.registerQuery(param);
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  public verifyService = async (userEmail: string, userPassword: string) => {
    try {
      //check if the email is existed
      const check = await this.userQuery.checkUser(userEmail);

      if (!check) throw new Error('This email is not exist');

      const salt = await genSalt(10);
      const hashPass = await hash(userPassword, salt);
      const data = await this.authQuery.verifyQuery(userEmail, hashPass);

      return data;
    } catch (error) {
      throw error;
    }
  };

  public loginService = async (userEmail: string, userPassword: string) => {
    try {
      const user = await this.userQuery.checkUser(userEmail);
      if (!user) throw new Error("User with those email doesn't exist");

      const check = await compare(userPassword, user.user_password);
      if (!check) throw new Error('Email and Password are incorrect');

      const payload = {
        id: user.id,
        userEmail: user.user_email,
        userName: user.user_name,
        isVerified: user.is_verified,
        role: user.role,
        userPhoto: user.user_photo,
      };

      const token = generateJWT(payload, '1h');
      return { token };
    } catch (error) {
      throw error;
    }
  };
}
