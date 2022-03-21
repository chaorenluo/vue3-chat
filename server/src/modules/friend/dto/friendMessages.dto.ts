import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class friendMessagesDto {
    @IsNotEmpty({ message: 'userId不能为空' })
    @IsString({ message: 'userId类型不正确' })
    readonly userId: string;

    @IsString({ message: 'friendId类型不正确' })
    @IsNotEmpty({ message: 'friendId不能为空' })
    readonly friendId: string;

    @IsNumber({}, { message: 'current类型不正确' })
    @IsNotEmpty({ message: 'current不能为空' })
    readonly current: number;

    @IsNumber({}, { message: 'pageSize类型不正确' })
    @IsNotEmpty({ message: 'pageSize不能为空' })
    readonly pageSize: number;
}
