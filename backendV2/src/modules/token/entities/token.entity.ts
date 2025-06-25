import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('token')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 500, nullable: true })
  access_token?: string;

  @Column({ type: 'timestamp', nullable: true })
  access_token_expires_at?: Date;

  @Index()
  @Column({ type: 'varchar', length: 500, nullable: true })
  refresh_token?: string;

  @Column({ type: 'timestamp', nullable: true })
  refresh_token_expires_at?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
