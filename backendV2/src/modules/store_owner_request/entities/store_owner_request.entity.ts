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

  // Thông tin kho đăng ký
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  business_license: string;

  @Column({ type: 'varchar', length: 255 })
  invenstory_address: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  invenstory_lat: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  invenstory_lng: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  invenstory_img: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_deleted!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
