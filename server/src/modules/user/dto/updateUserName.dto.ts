import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { nameReg } from '../../../common/tool/utils';

export class updateUserNameDto {
    @IsNotEmpty({ message: '账号不能为空' })
    @IsString({ message: 'userName 参数类型不正确' })
    @Matches(nameReg, { message: '用户名不符合规则' })
    readonly userName: string;
}
