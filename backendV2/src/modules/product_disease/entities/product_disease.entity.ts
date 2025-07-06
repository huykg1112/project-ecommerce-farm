import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Disease } from '../../disease/entities/disease.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('product_disease')
export class ProductDisease {
  @PrimaryColumn('uuid')
  product_id: string;

  @PrimaryColumn('uuid')
  disease_id: string;

  @ManyToOne(() => Product, (product) => product.productDiseases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Disease, (disease) => disease.productDiseases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'disease_id' })
  disease: Disease;

  @Column({ type: 'boolean', default: false })
  is_primary: boolean; // true: đặc trị, false: hỗ trợ

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
