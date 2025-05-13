import { User } from '@modules/users/entities/user.entity';
import {
      Column,
      CreateDateColumn,
      Entity,
      ManyToOne,
      PrimaryGeneratedColumn,
      UpdateDateColumn,
} from 'typeorm';

export enum VoucherType {
  NORMAL = 'NORMAL', // Voucher thông thường cho đại lý
  GLOBAL = 'GLOBAL', // Voucher toàn cục chỉ admin tạo được
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE', // Giảm theo phần trăm
  FIXED_AMOUNT = 'FIXED_AMOUNT', // Giảm theo số tiền cố định
}

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({
    type: 'enum',
    enum: VoucherType,
    default: VoucherType.NORMAL,
  })
  type!: VoucherType;

  @Column({
    type: 'enum',
    enum: DiscountType,
    default: DiscountType.PERCENTAGE,
  })
  discountType!: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountValue!: number; // Giá trị giảm giá (phần trăm hoặc số tiền)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minOrderValue!: number; // Giá trị đơn hàng tối thiểu để áp dụng

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxDiscountAmount!: number; // Số tiền giảm tối đa (cho voucher phần trăm)

  @Column({ type: 'int' })
  quantity!: number; // Số lượng voucher

  @Column({ type: 'int', default: 0 })
  usedCount!: number; // Số lần đã sử dụng

  @Column({ type: 'timestamp' })
  startDate!: Date;

  @Column({ type: 'timestamp' })
  endDate!: Date;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @ManyToOne(() => User, { nullable: true })
  createdBy!: User; // Người tạo voucher

  @ManyToOne(() => User, { nullable: true })
  distributor!: User; // Đại lý áp dụng (null nếu là voucher global)
}
