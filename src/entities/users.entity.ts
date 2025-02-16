import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { AccountRecoveryEntity } from './account-recovery.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  identificationNo!: string;

  @Column()
  dob!: Date;

  @Column()
  phoneNo!: number;

  @Column()
  profileImg!: string;

  @Column()
  googleId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

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
