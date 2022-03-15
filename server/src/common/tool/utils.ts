/**
 * 群名/用户名校验
 * @param name
 */
export const nameReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
export const nameVerify = (name: string) => {
    if (name.length === 0) {
        return false;
    }
    if (nameReg.test(name)) {
        return false;
    }
    return true;
};

/**
 * 密码校验
 * @param password
 */
export const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
export const passwordVerify = (password: string) => {
    if (password.length === 0) {
        return false;
    }
    if (passwordReg.test(password)) {
        return false;
    }
    return true;
};
