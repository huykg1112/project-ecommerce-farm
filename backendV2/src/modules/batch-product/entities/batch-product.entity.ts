import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invenstory } from '../../invenstory/entities/invenstory.entity';
import { OrderDetail } from '../../order-detail/entities/order-detail.entity';
import { ProductType } from '../../product-type/entities/product-type.entity';
import { Product } from '../../product/entities/product.entity';
import { Promotion } from '../../promotion/entities/promotion.entity';

@Entity('batch_product')
export class BatchProduct {
  @PrimaryGeneratedColumn('uuid')
  batch_id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Invenstory, (invenstory) => invenstory.batch_products)
  @JoinColumn({ name: 'invenstory_id' })
  invenstory: Invenstory;

  @Column({ length: 50 })
  batch_number!: string;

  @Column({ type: 'int', nullable: true })
  quantity!: number;

  @Column({ type: 'date', nullable: true })
  manufactured_date!: Date;

  @Column({ type: 'date', nullable: true })
  expiry_date!: Date;

  @Column({ type: 'int', default: 10, nullable: true })
  low_stock_threshold!: number;

  @Column({ type: 'float', nullable: false, default: 0 })
  unit_product_price!: number;

  @Column({ type: 'boolean', default: true, nullable: true })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_deleted!: boolean;

  @ManyToOne(() => ProductType, (productType) => productType.batch_products, {
    nullable: true,
  })
  product_types: ProductType;

  @OneToMany(() => OrderDetail, (orderItem) => orderItem.batch_product, {
    nullable: true,
  })
  order_details: OrderDetail[];

  // một lô hàng có nhiều nhiều giảm giá thông qua promotion và giảm giá có thể thuộc nhiều lô hàng
  @ManyToMany(() => Promotion, (promotion) => promotion.batch_products, {
    nullable: true,
  })
  @JoinTable({ name: 'batch_promotion' })
  promotions: Promotion[];
}
