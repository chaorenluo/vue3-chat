import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, GroupMap } from './entity/group.entity';
import { GroupMessage } from './entity/groupMessage.entity';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Group, GroupMap, GroupMessage])],
    providers: [GroupService],
    controllers: [GroupController],
})
export class GroupModule {}
