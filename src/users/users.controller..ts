import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRegisterDTO, UserUpdaterDTO } from './users.dto';
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
    return await this.userService.findUserProfileByEmail(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  async updateProfile(@Request() req, @Body() body: UserUpdaterDTO) {
    return await this.userService.updateUserProfile(req.user.email, body);
  }
}
