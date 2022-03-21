import { Body, Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FriendService } from './friend.service';
import { friendMessagesDto } from './dto/friendMessages.dto';

@Controller('friend')
@UseGuards(AuthGuard('jwt'))
export class friendController {
    constructor(private readonly FriendService: FriendService) {}

    getFriends(@Body('userId') userId: string) {
        return this.FriendService.getFriends(userId);
    }

    getFriendMessage(@Body() FriendMessageDto: friendMessagesDto) {
        return this.FriendService.getFriendMessages(FriendMessageDto);
    }
}
