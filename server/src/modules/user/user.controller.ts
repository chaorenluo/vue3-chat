import { Body, Controller, Get, Patch, Post, Query, Request, UseGuards, UploadedFile } from '@nestjs/common';
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

    @Post('/getUserByName')
    getUserByName(@Body() userByNameDto: userByNameDto) {
        return this.UserService.getUsersByName(userByNameDto.userName);
    }

    @Post('/setUserAvatar')
    setUserAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
        return this.UserService.setUserAvatar(req.user, file);
    }
}
