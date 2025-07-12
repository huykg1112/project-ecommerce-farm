import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BatchProduct } from '../../batch-product/entities/batch-product.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('order_detail')
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  order_detail_id: string;

  @ManyToOne(() => Order, (order) => order.order_details)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => BatchProduct, (batch_product) => batch_product.order_details)
  @JoinColumn({ name: 'batch_id' })
  batch_product: BatchProduct;

  @Column({ type: 'int', nullable: true })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unit_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  subtotal!: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column({ type: 'boolean', default: false, nullable: true })
  is_deleted!: boolean;
}
