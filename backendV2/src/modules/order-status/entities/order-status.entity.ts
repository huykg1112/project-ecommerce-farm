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

export enum OrderStatusDescription {
  PENDING = 'Đơn hàng đang chờ xác nhận',
  CONFIRMED = 'Đơn hàng đã được xác nhận',
  SHIPPING = 'Đơn hàng đang trong quá trình giao hàng',
  DELIVERED = 'Đơn hàng đã được giao thành công',
  CANCELLED = 'Đơn hàng đã bị hủy',
  RETURNED = 'Đơn hàng đã được trả lại',
  FAILED = 'Đơn hàng đã thất bại',
  REFUNDED = 'Đơn hàng đã được hoàn tiền',
  COMPLETED = 'Đơn hàng đã hoàn thành',
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
