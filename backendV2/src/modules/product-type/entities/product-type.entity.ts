import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToMany(() => BatchProduct, (batch_product) => batch_product.product_types)
  batch_products: BatchProduct[];
}
