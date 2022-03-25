import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserMap } from '../friend/entity/friend.entity';
import { Group, GroupMap } from '../group/entity/group.entity';
import { GroupMessage } from '../group/entity/groupMessage.entity';
import { FriendMessage } from '../friend/entity/friendMessage.entity';
@Module({
    imports: [TypeOrmModule.forFeature([User, UserMap, Group, GroupMap, GroupMessage, FriendMessage])],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
