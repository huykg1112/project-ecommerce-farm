import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Promotion } from '../../promotion/entities/promotion.entity';
import { User } from '../../user/entities/user.entity';

@Entity('voucher')
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  voucher_id: string;

  @Column({ length: 50, unique: true })
  voucher_code!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  min_order_value!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  max_discount_value!: number;

  @Column({ type: 'int', nullable: true })
  usage_limit!: number;

  @Column({ type: 'int', default: 0, nullable: true })
  used_count!: number;

  @Column({ type: 'timestamp', nullable: true })
  start_date!: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date!: Date;

  @Column({ type: 'boolean', default: true, nullable: true })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_deleted!: boolean;

  @ManyToMany(() => User, (user) => user.vouchers)
  users: User[];

  // 1 voucher đc tạo bởi 1 người đã đăng ký làm store owner và 1 người đã đăng ký làm store owner có thể có nhiều voucher
  @ManyToOne(() => User, (user) => user.vouchers_distributor)
  distributor!: User;
}
