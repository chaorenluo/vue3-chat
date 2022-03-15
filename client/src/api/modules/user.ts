import fetch from '@/utils/http/axios';

const user = {
  register(payload: any) {
    return fetch.post('auth/register', {
      ...payload,
    });
  },
  login(payload: any) {
    return fetch.post('auth/login', {
      ...payload,
    });
  },
  /**
   * 更新用户名
   * @param params
   */
  updateUserName(userName: string) {
    return fetch.post('/user/username', {
      userName,
    });
  },
  /**
   * 更新用户密码
   * @param params
   */
  updatePassword(password: string) {
    return fetch.post(`/user/password`, {
      password,
    });
  },
  /**
   * 用户名模糊搜索用户
   * @param username
   */
  getUserByName(username: string) {
    return fetch.get('/user/findByName', {
      params: { username },
    });
  },
  /**
   * 用户头像上传
   * @param params
   */
  setUserAvatar(params: FormData) {
    return fetch.post('/user/setUserAvatar', params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  /**
   * 删除用户
   * @param params
   */
  deleteUser(params: any) {
    return fetch.delete('/user/del', { params });
  },
};

export default user;
