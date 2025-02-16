import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { AccountRecoveryEntity } from './account-recovery.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password!: string;

  @Column({ nullable: true })
  identificationNo!: string;

  @Column({ nullable: true })
  dob!: Date;

  @Column({ nullable: true })
  phoneNo!: number;

  @Column({ nullable: true })
  profileImg!: string;

  @Column({ nullable: true })
  googleId!: string;

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
}
