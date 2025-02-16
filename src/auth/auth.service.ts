import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenPayload,
  UserValidate,
} from './interface/user-auth.interface';
import { UserRegisterDTO } from 'src/users/users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { AccountRecoveryEntity } from 'src/entities/account-recovery.entity';
import { MailService } from 'src/mail/mail.service';
import { MailBodyPayload } from 'src/mail/interface/mail.interface';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { ResetPasswordDTO } from './auth.dto';
import { AUTH_ERROR, USER_ERROR } from 'src/config/error.constant';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(AccountRecoveryEntity)
    private accRecoveryRepo: Repository<AccountRecoveryEntity>,
    private mailService: MailService,
    private configService: ConfigService,
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

  async accountRecovery(email: string): Promise<void> {
    const user = await this.userRepo.findOne({
      where: { email, googleId: IsNull() },
    });

    if (!user) return;

    const recoveryToken = nanoid(64);

    const now = new Date();

    const accRecovery = this.accRecoveryRepo.create({
      user,
      token: recoveryToken,
      hasRecovered: false,
      expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000),
    });

    await this.accRecoveryRepo.save(accRecovery);

    const mailPayload: MailBodyPayload = {
      to: user.email,
      subject: 'Skillane account recovery',
      html: `
    <h1>Skillane Account Recovery</h1>
    <p>Hello,</p>
    <p>We received a request to reset your Skillane account password.</p>
    <p>If you did not request this, you can safely ignore this email.</p>
    <p>Otherwise, click the button below to reset your password:</p>
    <p>
      <a href="${this.configService.get('RESET_URL')}?token=${recoveryToken}" 
         style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 16px; font-weight: bold;">
        Reset Password
      </a>
    </p>
    <p>This link will expire in <strong>2 hours</strong>.</p>
  `,
    };
    await this.mailService.sendEmail(mailPayload);
  }

  async resetPassword(body: ResetPasswordDTO) {
    const user = await this.userRepo.findOne({
      where: { email: body.email, googleId: IsNull() },
    });

    if (!user) {
      throw new HttpException(USER_ERROR.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const accRecovery = await this.accRecoveryRepo.findOne({
      where: {
        user: { id: user.id },
        expiresAt: MoreThan(new Date()),
        hasRecovered: false,
        token: body.resetToken,
      },
    });

    if (!accRecovery) {
      throw new HttpException(
        AUTH_ERROR.RECOVERY_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    Object.assign(accRecovery, { hasRecovered: true });
    await this.accRecoveryRepo.save(accRecovery);

    Object.assign(user, { password: body.newPassword });
    await this.userRepo.save(user);
  }
}
