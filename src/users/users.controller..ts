import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRegisterDTO } from './users.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/register')
  async registerUser(@Body() body: UserRegisterDTO) {
    await this.userService.createUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    console.log('🌟⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️🌟 >>>>>> req', req);
    return req.user;
  }
}
