'use client';
import parseJWT from '@/utils/parseJwt';
import { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
export interface IUser {
  id: number;
  userEmail: string;
  userName: string | null;
  isVerified: boolean;
  role: string;
  userPhoto: string | null;
  iat: number;
  exp: number;
  token: string;
}

interface AuthContext {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  useLogout: () => void;
  useLogin: (user: IUser, token: string) => void;
}

export const AuthContext = createContext<AuthContext>({
  user: null,
  setUser: () => {},
  useLogout: () => {},
  useLogin: () => {},
});

export const AuthProvider = (props: any) => {
  const [user, setUser] = useState<IUser | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('token');
      if (token) {
        try {
          const userDetail = parseJWT(token.toString());
          setUser({ ...userDetail });
        } catch (error) {
          console.error('Error parsing JWT:', error);
          setUser(null); // Clear user state on error
        }
      } else {
        setUser(null); // Clear user state if no token found
      }
    }
  }, []);

  const useLogout = (): void => {
    Cookies.remove('token');
    setUser(null);
  };

  const useLogin = (userDetail: IUser, token: string): void => {
    if (token) {
      const in30Minutes = 1 / 48;
      setUser(userDetail);
      Cookies.set('token', token, {
        expires: in30Minutes,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, useLogout, useLogin }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
