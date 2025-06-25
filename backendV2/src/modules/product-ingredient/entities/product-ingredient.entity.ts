import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ActiveIngredient } from '../../active-ingredient/entities/active-ingredient.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('product_ingredient')
export class ProductIngredient {
  @PrimaryColumn('uuid')
  product_id: string;

  @PrimaryColumn('uuid')
  ingredient_id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ActiveIngredient)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: ActiveIngredient;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  concentration!: number;

  @Column({ type: 'boolean', default: false, nullable: true })
  is_primary: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
