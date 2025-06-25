import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from '../../address/entities/address.entity';
import { OrderDetail } from '../../order-detail/entities/order-detail.entity';
import { OrderStatus } from '../../order-status/entities/order-status.entity';
import { PaymentMethod } from '../../payment-method/entities/payment-method.entity';
import { User } from '../../user/entities/user.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  order_id: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'distributor_id' })
  distributor!: User;

  @ManyToOne(() => OrderStatus)
  @JoinColumn({ name: 'status_id' })
  status!: OrderStatus;

  @ManyToOne(() => PaymentMethod)
  @JoinColumn({ name: 'payment_method_id' })
  payment_method!: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_amount!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  order_details: OrderDetail[];
}
