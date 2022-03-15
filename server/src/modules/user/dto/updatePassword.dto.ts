import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { passwordReg } from '../../../common/tool/utils';

export class updatePasswordDto {
    @IsNotEmpty({ message: '密码不能为空' })
    @IsString({ message: 'password 参数类型不正确' })
    @Matches(passwordReg, { message: '密码规则不符合' })
    readonly password: string;
}
