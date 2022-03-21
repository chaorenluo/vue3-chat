import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMap } from './entity/friend.entity';
import { FriendMessage } from './entity/friendMessage.entity';
import { FriendService } from './friend.service';
import { friendController } from './friend.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UserMap, FriendMessage])],
    providers: [FriendService],
    controllers: [friendController],
})
export class FriendModule {}
