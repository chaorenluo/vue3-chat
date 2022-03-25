import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository, Like } from 'typeorm';
import { join } from 'path';
import { RCode } from '../../common/constant';
import { CustomException } from '../../common/filters/CustomException';
import { createWriteStream } from 'fs';
import { Express } from 'express';
import { UserMap } from '../friend/entity/friend.entity';
import { Group, GroupMap } from '../group/entity/group.entity';
import { GroupMessage } from '../group/entity/groupMessage.entity';
import { FriendMessage } from '../friend/entity/friendMessage.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserMap)
        private readonly userMapRepository: Repository<UserMap>,
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        @InjectRepository(GroupMap)
        private readonly groupMapRepository: Repository<GroupMap>,
        @InjectRepository(GroupMessage)
        private readonly groupMessageRepository: Repository<GroupMessage>,
        @InjectRepository(FriendMessage)
        private readonly friendMessageRepository: Repository<FriendMessage>
    ) {}

    async updateUserName(user: User, userName: string) {
        try {
            const isHaveName = await this.userRepository.findOne({ userName });
            if (isHaveName) {
                throw new CustomException('用户名重复', RCode.FAIL);
            }
            const newUser = JSON.parse(JSON.stringify(user)) as User;
            newUser.userName = userName;
            await this.userRepository.update(user, newUser);
            return { msg: '更新用户名成功', data: newUser };
        } catch (e) {
            throw new CustomException('更新失败', RCode.FAIL);
        }
    }

    async updatePassword(user: User, password: string) {
        try {
            const newUser = JSON.parse(JSON.stringify(user)) as User;
            newUser.password = password;
            await this.userRepository.update(user, newUser);
            return { msg: '更新用户密码成功', data: newUser };
        } catch (e) {
            throw new CustomException('更新失败:' + e, RCode.FAIL);
        }
    }

    async getUsersByName(userName: string) {
        try {
            const users = await this.userRepository.find({
                where: { userName: Like(`%${userName}%`) },
            });
            return { data: users };
        } catch (e) {
            throw new CustomException('查询失败:' + e, RCode.FAIL);
        }
    }

    async setUserAvatar(user: User, file: Express.Multer.File) {
        try {
            const random = Date.now() + '&';
            const stream = createWriteStream(join('public/avatar', random + file.originalname));
            stream.write(file.buffer);
            user.avatar = `api/avatar/${random}${file.originalname}`;
            await this.userRepository.save(user);
            return { msg: '修改头像成功', data: user };
        } catch (e) {
            throw new CustomException('修改头像失败:' + e, RCode.FAIL);
        }
    }

    async delUser(user: User, did: string) {
        try {
            if (!did) {
                throw new CustomException('缺少被删除用户的id:', RCode.FAIL);
            }
            if (user.role === 'admin') {
                //删除用户自己创建的群
                const groups = await this.groupRepository.find({ userId: did });
                for (const group of groups) {
                    await this.groupMessageRepository.delete({ groupId: group.groupId });
                    await this.groupMapRepository.delete({ groupId: group.groupId });
                    await this.groupRepository.delete({ groupId: group.groupId });
                }
                //删除加入的群
                await this.groupMapRepository.delete({ userId: did });
                await this.groupMessageRepository.delete({ userId: did });
                //被删除的用户好友
                await this.userMapRepository.delete({ friendId: did });
                await this.userMapRepository.delete({ userId: did });
                await this.friendMessageRepository.delete({ userId: did });
                await this.friendMessageRepository.delete({ friendId: did });
                await this.userRepository.delete({ userId: did });
                return { msg: '用户删除成功' };
            }
            return { code: RCode.FAIL, msg: '用户删除失败' };
        } catch (e) {
            throw new CustomException('缺少被删除用户的id:' + e, RCode.FAIL);
        }
    }
}
