import { defineStore } from 'pinia';
import cookie from 'js-cookie';
import api from '@api';
import { processReturn } from '@utils/common';

export interface AppState {
  user: User;
  token: string;
  mobile: boolean;
  background: string;
}

const getDefaultUser = (): User => {
  return {
    userId: '',
    userName: '',
    password: '',
    avatar: '',
    createTime: 0,
  };
};

export const useAppStore = defineStore({
  id: 'app-store',
  state: (): AppState => ({
    user: getDefaultUser(),
    token: '',
    mobile: false,
    background: '',
  }),
  actions: {
    async register(payload: pickUser) {
      const res = await api.user.register(payload);
      const data = processReturn(res);
      if (data) {
        this.setToken(data.token);
        this.setUser(data.user);
      }
      return data;
    },
    async login(payload: pickUser) {
      const res = await api.user.login(payload);
      const data = processReturn(res);
      if (data) {
        this.setToken(data.token);
        this.setUser(data.user);
        return data;
      }
      return data;
    },
    async getUser() {
      const res = await api.user.getUser();
      const data = processReturn(res);
      if (data.code === 401) {
        return new Error('登录失效');
      } else {
        this.setUser(data);
      }
    },
    setToken(payload: string) {
      this.token = payload;
      cookie.set('token', payload, { expires: 3 });
    },
    setUser(payload: User) {
      this.user = payload;
    },
    setBackground(payload: string) {
      this.background = payload;
      localStorage.setItem('background', payload);
    },
    setMobile(payload: boolean) {
      this.mobile = payload as any;
    },
    clearUser() {
      this.user = getDefaultUser();
      cookie.remove('token');
    },
  },
});
