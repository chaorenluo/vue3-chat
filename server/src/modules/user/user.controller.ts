import { Body, Controller, Get, Post, Request, UseGuards, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Express } from 'express';
import { UserService } from './user.service';
import { updateUserNameDto, updatePasswordDto, userByNameDto } from './dto/index.dto';
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
    constructor(private readonly UserService: UserService) {}

    @Get()
    getUser(@Request() req) {
        return { data: req.user };
    }

    @Post('/updateUsername')
    updateUserName(@Request() req, @Body() updateUserNameDto: updateUserNameDto) {
        return this.UserService.updateUserName(req.user, updateUserNameDto.userName);
    }

    @Post('/updatePassword')
    updatePassword(@Request() req, @Body() updatePasswordDto: updatePasswordDto) {
        return this.UserService.updatePassword(req.user, updatePasswordDto.password);
    }

    @Get('/getUserByName')
    getUserByName(@Query() userByNameDto: userByNameDto) {
        return this.UserService.getUsersByName(userByNameDto.userName);
    }

    @Post('/setUserAvatar')
    @UseInterceptors(FileInterceptor('avatar'))
    setUserAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
        return this.UserService.setUserAvatar(req.user, file);
    }
}
