import axios from 'axios';

export interface AuthState {
  username: string;
  password: string;
  password2?: string;
}

type AuthFn = (params: AuthState) => Promise<any>;

export const logIn: AuthFn = async (data) => {
  try {
    const res = await axios.post('/api/user/login', data);
    return res;
  } catch (err) {
    console.error(err);
  }
};
