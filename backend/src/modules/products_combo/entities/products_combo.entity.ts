import { Product } from '@modules/product/entities/product.entity';
import { User } from '@modules/users/entities/user.entity';
import {
      Column,
      CreateDateColumn,
      Entity,
      JoinTable,
      ManyToMany,
      ManyToOne,
      PrimaryGeneratedColumn,
      UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ProductsCombo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  originalPrice!: number; // Tổng giá gốc của các sản phẩm

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountPrice!: number; // Giá sau khi giảm giá (nếu có)

  @Column({ type: 'int', default: 0 })
  discountPercentage!: number; // Phần trăm giảm giá

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @ManyToOne(() => User)
  distributor!: User; // Đại lý tạo combo

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'products_combo_items', // Tên bảng trung gian
    joinColumn: {
      name: 'combo_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products!: Product[]; // Danh sách sản phẩm trong combo
}
