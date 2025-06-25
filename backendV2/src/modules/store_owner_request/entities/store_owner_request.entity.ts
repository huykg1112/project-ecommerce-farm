import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('store_owner_request')
export class StoreOwnerRequest {
  @PrimaryGeneratedColumn('uuid')
  store_owner_request_id: string;

  @OneToOne(() => User, (user) => user.store_owner_request)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  request_date!: Date;

  @Column({ type: 'boolean', default: false })
  request_status!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  approved_date!: Date;
}
