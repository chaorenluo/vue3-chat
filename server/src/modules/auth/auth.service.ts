import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { RCode } from '../../common/constant/rcode';

import { CustomException } from '../../common/filters/CustomException';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    async login(data: User): Promise<any> {
        const user = await this.userRepository.findOne({ userName: data.userName, password: data.password });
        if (!user) {
            throw new CustomException('账号不存在或密码错误', RCode.FAIL, HttpStatus.OK);
        }
        const payload = { userId: user.userId, password: user.password };
        return {
            msg: '登录成功',
            code: RCode.OK,
            data: {
                user,
                token: this.jwtService.sign(payload),
            },
        };
    }

    async register(user: User): Promise<any> {
        const isHave = await this.userRepository.find({ userName: user.userName });
        if (isHave.length > 0) {
            return { code: RCode.FAIL, msg: '用户名重复', data: '' };
            throw new CustomException('用户名重复', RCode.FAIL, HttpStatus.OK);
        }
        user.avatar = `api/avatar/avatar(${Math.round(Math.random() * 19 + 1)}).png`;
        user.role = 'user';
        const newUser = await this.userRepository.save(user);
        const payload = { userId: newUser.userId, password: newUser.password };
        return {
            msg: '注册成功',
            data: {
                user: newUser,
                token: this.jwtService.sign(payload),
            },
        };
    }
}
