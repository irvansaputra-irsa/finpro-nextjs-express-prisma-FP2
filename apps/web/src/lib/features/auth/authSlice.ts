import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { IUsers } from '@/interface/user.interface';
import parseJWT from '@/utils/parseJwt';
import instance from '@/utils/axiosInstance';

type User = {
  email: string;
  isVerified: boolean;
  avatar?: string;
};

type Status = {
  isLogin: boolean;
};

interface Auth {
  user: User;
  status: Status;
}

const initialState: Auth = {
  user: {
    email: '',
    isVerified: false,
    avatar: '',
  },
  status: {
    isLogin: false,
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginState: (state: Auth, action: PayloadAction<User>) => {
      const user = action.payload;
      state.user = user;
      state.status.isLogin = true;
    },
    logoutState: (state: Auth) => {
      state.user = initialState.user;
      state.status = initialState.status;
    },
    tokenValidState: (state: Auth, action: PayloadAction<User>) => {
      const user = action.payload;
      state.user = user;
      state.status.isLogin = true;
    },
  },
});

export const signIn = (params: IUsers) => async (dispatch: Dispatch) => {
  try {
    const { email, password } = params;

    const { data } = await instance.post('/auth/login', {
      email,
      password,
    });
    const payload = await parseJWT(data?.data);

    dispatch(
      loginState({
        email: payload?.email,
        isVerified: payload?.isVerified,
        avatar: payload?.avatar,
      }),
    );
    console.log(data?.data);
    localStorage.setItem('token', JSON.stringify(data?.data));
  } catch (err) {
    console.log(err);
    alert('Email atau Password salah');
  }
};

export const signOut = () => async (dispatch: Dispatch) => {
  try {
    dispatch(logoutState());
    localStorage.removeItem('token');
  } catch (err) {
    console.log(err);
  }
};

export const checkToken = (token: string) => async (dispatch: Dispatch) => {
  try {
    const { data } = await instance.get('/auth', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const payload = await parseJWT(data?.data);
    dispatch(
      tokenValidState({
        email: payload?.email,
        isVerified: payload?.isVerified,
        avatar: payload?.avatar,
      }),
    );
    localStorage.setItem('token', JSON.stringify(data?.data));
  } catch (err) {
    console.log(err);
  }
};

export const { loginState, logoutState, tokenValidState } = authSlice.actions;

export default authSlice.reducer;
