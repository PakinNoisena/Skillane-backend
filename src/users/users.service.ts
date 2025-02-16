import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { UserRegisterDTO } from './users.dto';
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
    const userEntity = this.userRepo.create(body);
    await this.userRepo.save(userEntity);
  }
}
