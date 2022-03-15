import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { nameReg, passwordReg } from '../../../common/tool/utils';

export class authDto {
    @IsNotEmpty({ message: '账号不能为空' })
    @IsString({ message: 'userName 参数类型不正确' })
    @Matches(nameReg, { message: '用户名不符合规则' })
    readonly userName: string;
    @IsNotEmpty({ message: '密码不能为空' })
    @IsString({ message: 'password 参数类型不正确' })
    @Matches(passwordReg, { message: '密码规则不符合' })
    readonly password: string;
}
