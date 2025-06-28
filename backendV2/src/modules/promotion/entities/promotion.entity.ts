import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BatchProduct } from '../../batch-product/entities/batch-product.entity';
import { User } from '../../user/entities/user.entity';

@Entity('promotion')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  promotion_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'distributor_id' })
  created_by: User;

  @Column({ type: 'varchar', length: 100, nullable: true })
  promotion_name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_value!: number;

  @Column({ type: 'timestamp', nullable: true })
  start_date!: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date!: Date;

  @Column({ type: 'boolean', default: true, nullable: true })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToMany(() => BatchProduct, (batch_product) => batch_product.promotions, {
    nullable: true,
  })
  batch_products: BatchProduct[];
}
