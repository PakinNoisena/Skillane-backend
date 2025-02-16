import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenPayload,
  UserValidate,
} from './interface/user-auth.interface';
import { UserRegisterDTO } from 'src/users/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserValidate | null> {
    const user = await this.userService.findUserByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return { email: user.email, userId: user.id };
    }

    return null;
  }

  async login(user: UserValidate): Promise<AccessTokenPayload> {
    const payload = { username: user.email, sub: user.userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async googleLogin(req): Promise<AccessTokenPayload> {
    const { email, googleId } = req.user;

    // Find or create user
    let user = await this.userService.findUserByEmail(email);
    if (!user) {
      await this.userService.createUser({
        email,
        googleId,
      } as UserRegisterDTO);

      user = await this.userService.findUserByEmail(email);
    }
    req.user = {
      email,
      userId: user?.id,
    };
    return {
      accessToken: this.jwtService.sign({ username: email, sub: user?.id }),
    };
  }
}
