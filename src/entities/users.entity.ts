import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  BeforeUpdate,
  BeforeInsert,
  AfterLoad,
} from 'typeorm';
import { AccountRecoveryEntity } from './account-recovery.entity';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  identificationNo!: string;

  @Column({ nullable: true })
  dob!: Date;

  @Column({ nullable: true })
  phoneNo!: number;

  @Column({ nullable: true })
  profileImg!: string;

  @Column({ nullable: true })
  googleId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt!: Date;

  @OneToMany(
    () => AccountRecoveryEntity,
    (accountRecovery) => accountRecovery.user,
    {
      cascade: ['remove'],
      onDelete: 'CASCADE',
    },
  )
  accountRecoveries!: AccountRecoveryEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2a$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @AfterLoad()
  async load() {
    if (this.identificationNo && this.identificationNo !== '') {
      this.identificationNo = `*********${this.identificationNo?.slice(-4)}`;
    }
  }
}
