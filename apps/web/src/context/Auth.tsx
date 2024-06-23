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
}

export const AuthContext = createContext<AuthContext>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = (props: any) => {
  const tokens = Cookies.get('token');
  const [user, setUser] = useState<IUser | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const primaryToken = tokens || null;
      if (primaryToken) {
        try {
          const userDetail = parseJWT(primaryToken.toString());
          setUser({ ...userDetail, token: primaryToken });
        } catch (error) {
          console.error('Error parsing JWT:', error);
          setUser(null); // Clear user state on error
        }
      } else {
        setUser(null); // Clear user state if no token found
      }
    }
  }, [tokens]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
