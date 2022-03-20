import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupService } from './group.service';

@Controller('group')
@UseGuards(AuthGuard('jwt'))
export class GroupController {
    constructor(private readonly groupServer: GroupService) {}

    @Post()
    postGroup(@Body('groupId') groupIds: string) {
        return this.groupServer.postGroups(groupIds);
    }

    @Get('/userGroup')
    getUserGroups(@Query('userId') userId: string) {
        return this.groupServer.getUserGroups(userId);
    }

    @Get('/groupUser')
    getGroupUsers(@Query('groupId') groupId: string) {
        return this.groupServer.getGroupUsers(groupId);
    }

    @Get('/findByName')
    getGroupsByName(@Query('groupName') groupName: string) {
        return this.groupServer.getGroupsByName(groupName);
    }
}
