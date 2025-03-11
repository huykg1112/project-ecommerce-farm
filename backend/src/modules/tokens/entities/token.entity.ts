import { User } from '@modules/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 500, nullable: true })
  accessToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  accessTokenExpiresAt?: Date;

  @Index()
  @Column({ type: 'varchar', length: 500, nullable: true })
  refreshToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  refreshTokenExpiresAt?: Date;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User; // Quan hệ ManyToOne với User
}
