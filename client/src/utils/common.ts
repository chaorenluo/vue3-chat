import { AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
export const processReturn = (res: AxiosResponse<ServerRes>) => {
  // code 0:成功 1:错误 2:后端报错
  if (!res) {
    return;
  }
  const { code, msg, data } = res.data;
  if (code) {
    message.error(msg);
    return;
  }
  if (msg) {
    message.success(msg);
  }
  return data;
};

/**
 * 群名/用户名校验
 * @param name
 */
export function nameVerify(name: string): boolean {
  const nameReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
  if (name.length === 0) {
    message.error('请输入名字');
    return false;
  }
  if (!nameReg.test(name)) {
    message.error('名字只含有汉字、字母、数字和下划线 不能以下划线开头和结尾');
    return false;
  }
  if (name.length > 9) {
    message.error('名字太长');
    return false;
  }
  return true;
}

/**
 * 密码校验
 * @param password
 */
export function passwordVerify(password: string): boolean {
  const passwordReg = /^\w+$/is;
  if (password.length === 0) {
    message.error('请输入密码');
    return false;
  }
  if (!passwordReg.test(password)) {
    message.error('密码只含有字母、数字和下划线');
    return false;
  }
  if (password.length > 9) {
    message.error('密码太长');
    return false;
  }
  return true;
}

// 判断一个字符串是否包含另外一个字符串
export function isContainStr(str1: string, str2: string) {
  return str2.indexOf(str1) >= 0;
}
