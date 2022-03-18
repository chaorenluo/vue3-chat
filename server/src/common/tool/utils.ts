/**
 * 群名/用户名校验
 * @param name
 */
export const nameReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;

/**
 * 密码校验
 * @param password
 */
export const passwordReg = /^\w+$/is;
