import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMap } from './entity/friend.entity';
import { getRepository, Repository } from 'typeorm';
import { FriendMessage } from './entity/friendMessage.entity';
import { CustomException } from '../../common/filters/CustomException';
import { RCode } from '../../common/constant';
import { friendMessagesDto } from './dto/friendMessages.dto';

@Injectable()
export class FriendService {
    constructor(
        @InjectRepository(UserMap)
        private readonly friendRepository: Repository<UserMap>,
        @InjectRepository(FriendMessage)
        private readonly friendMessageRepository: Repository<FriendMessage>
    ) {}

    async getFriends(userId: string) {
        try {
            if (userId) {
                return { msg: '获取用户好友成功', data: await this.friendRepository.find({ userId: userId }) };
            } else {
                throw new CustomException('userId不存在', RCode.FAIL);
            }
        } catch (e) {
            throw new CustomException('获取用户好友失败:' + e, RCode.FAIL);
        }
    }

    async getFriendMessages(friendMessagesDto: friendMessagesDto) {
        try {
            const messages = await getRepository(FriendMessage)
                .createQueryBuilder('friendMessage')
                .orderBy('friendMessage.time', 'DESC')
                .where('friendMessage.userId=:userId AND friendMessage.friendId=:friendId', {
                    userId: friendMessagesDto.userId,
                    friendId: friendMessagesDto.friendId,
                })
                .skip(friendMessagesDto.current)
                .take(friendMessagesDto.pageSize)
                .getMany();
            return { msg: '', data: { messageArr: messages.reverse() } };
        } catch (e) {
            throw new CustomException('获取好友消息失败:' + e, RCode.FAIL);
        }
    }
}
