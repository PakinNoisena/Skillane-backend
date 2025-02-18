import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { UserRegisterDTO, UserUpdaterDTO } from './users.dto';
import { USER_ERROR } from 'src/config/error.constant';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    return user;
  }

  async createUser(body: UserRegisterDTO): Promise<void> {
    const user = await this.findUserByEmail(body.email);
    if (user) {
      throw new HttpException(
        USER_ERROR.USER_ALREADY_EXIST,
        HttpStatus.CONFLICT,
      );
    }
    const userEntity = this.userRepo.create({ ...body, isFirstEdit: false });
    await this.userRepo.save(userEntity);
  }

  async findUserProfileByEmail(email: string): Promise<Partial<UserEntity>> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(USER_ERROR.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const userObject = { ...user };
    delete userObject.password;
    delete userObject.googleId;

    return userObject;
  }

  async updateUserProfile(
    email: string,
    body: UserUpdaterDTO,
  ): Promise<Partial<UserEntity>> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(USER_ERROR.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!user.isFirstEdit) {
      Object.assign(body, { isFirstEdit: true });
    }

    Object.assign(user, body);

    await this.userRepo.save(user);

    return await this.findUserProfileByEmail(email);
  }
}
