import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository, Like } from 'typeorm';
import { join } from 'path';
import { RCode } from '../../common/constant/rcode';
import { CustomException } from '../../common/filters/CustomException';
import { createWriteStream } from 'fs';
import { Express } from 'express';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async updateUserName(user: User, userName: string) {
        if (user) {
            const isHaveName = await this.userRepository.findOne({ userName });
            if (isHaveName) {
                throw new CustomException('用户名重复', RCode.FAIL);
            }
            const newUser = JSON.parse(JSON.stringify(user)) as User;
            newUser.userName = userName;
            await this.userRepository.update(user, newUser);
            return { msg: '更新用户名成功', data: newUser };
        }
        throw new CustomException('更新失败', RCode.FAIL);
    }

    async updatePassword(user: User, password: string) {
        if (user) {
            const newUser = JSON.parse(JSON.stringify(user)) as User;
            newUser.password = password;
            await this.userRepository.update(user, newUser);
            return { msg: '更新用户密码成功', data: newUser };
        }
        return { code: RCode.FAIL, msg: '更新失败', data: '' };
    }

    async getUsersByName(userName: string) {
        const users = await this.userRepository.find({
            where: { userName: Like(`%${userName}%`) },
        });
        return { data: users };
    }

    async setUserAvatar(user: User, file: Express.Multer.File) {
        const random = Date.now() + '&';
        const stream = createWriteStream(join('public/avatar', random + file.originalname));
        stream.write(file.buffer);
        user.avatar = `api/avatar/${random}${file.originalname}`;
        await this.userRepository.save(user);
        return { msg: '修改头像成功', data: user };
    }
}
