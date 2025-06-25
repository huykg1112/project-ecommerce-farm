import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BatchProduct } from '../../batch-product/entities/batch-product.entity';

@Entity('product_type')
export class ProductType {
  @PrimaryGeneratedColumn('uuid')
  product_type_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type_name!: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true, nullable: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToMany(
    () => BatchProduct,
    (batch_product) => batch_product.product_types,
  )
  @JoinTable({ name: 'batch_product_type' }) // Bảng trung gian
  batch_products: BatchProduct[];
}
