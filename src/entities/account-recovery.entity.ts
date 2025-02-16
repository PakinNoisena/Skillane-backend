import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from './users.entity';

@Entity('account_recoveries')
export class AccountRecoveryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  token!: string;

  @Column({ type: 'boolean', default: false })
  hasRecovered!: boolean;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.accountRecoveries, {
    onDelete: 'CASCADE',
  })
  user!: UserEntity;
}
