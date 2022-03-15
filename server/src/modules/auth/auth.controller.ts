import { Controller, Get, Post, Request, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '../user/entity/user.entity';
import { authDto } from './dto/auth.dto';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    async login(@Body() userDro: authDto) {
        return this.authService.login(userDro as User);
    }

    @Post('/register')
    async register(@Body() userDto: authDto) {
        return this.authService.register(userDto as User);
    }
}
