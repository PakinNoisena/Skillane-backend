import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guard/local-auth.guard';
import { USER_ERROR } from 'src/config/error.constant';
import { isEmpty } from 'lodash';
import { UserValidate } from './interface/user-auth.interface';
import { GoogleAuthGuard } from 'src/guard/google-auth.guard';
import { AccRecoveryDTO, ResetPasswordDTO } from './auth.dto';
import { Response } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req) {
    const user = req.user as UserValidate;
    if (isEmpty(user)) {
      throw new HttpException(USER_ERROR.USER_REQUIRED, HttpStatus.BAD_REQUEST);
    }
    const { accessToken } = await this.authService.login(user);
    return { accessToken };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req: Request) {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.googleLogin(req);
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.redirect('http://localhost:3000/');
    return { accessToken };
  }

  @Post('/recover')
  async accountRecovery(@Body() body: AccRecoveryDTO) {
    return this.authService.accountRecovery(body.email);
  }

  @Post('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDTO) {
    return this.authService.resetPassword(body);
  }
}
