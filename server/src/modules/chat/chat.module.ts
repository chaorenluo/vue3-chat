import { Inject, Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { UserMap } from '../friend/entity/friend.entity';
import { FriendMessage } from '../friend/entity/friendMessage.entity';
import { User } from '../user/entity/user.entity';
import { Group, GroupMap } from '../group/entity/group.entity';
import { GroupMessage } from '../group/entity/groupMessage.entity';
import { ChatGateway } from './chat.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserMap, FriendMessage, Group, GroupMap, GroupMessage])],
    providers: [ChatGateway],
})
export class ChatModule {
    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>
    ) {}
    async onModuleInit() {
        const defaultGroup = await this.groupRepository.find({ groupName: '阿童木聊天室' });
        console.log(defaultGroup);
        if (!defaultGroup.length) {
            await this.groupRepository.save({
                groupId: '阿童木聊天室',
                groupName: '阿童木聊天室',
                userId: 'admin',
                createTime: new Date().valueOf(),
            });
            console.log('create default group 阿童木聊天室');
        }
    }
}
