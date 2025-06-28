import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum OrderStatusEnum {
  PENDING = 'PENDING', // Chờ xác nhận
  CONFIRMED = 'CONFIRMED', // Đã xác nhận
  SHIPPING = 'SHIPPING', // Đang giao hàng
  DELIVERED = 'DELIVERED', // Đã giao hàng
  CANCELLED = 'CANCELLED', // Đã hủy
  RETURNED = 'RETURNED', // Đã trả hàng
  FAILED = 'FAILED', // Giao hàng thất bại
  REFUNDED = 'REFUNDED', // Đã hoàn tiền
  COMPLETED = 'COMPLETED', // Hoàn thành
}

@Entity('order_status')
export class OrderStatus {
  @PrimaryGeneratedColumn('uuid')
  status_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status_name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'boolean', default: true, nullable: true })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}
