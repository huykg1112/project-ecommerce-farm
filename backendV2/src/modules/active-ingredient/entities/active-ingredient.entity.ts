import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductIngredient } from '../../product-ingredient/entities/product-ingredient.entity';

@Entity('active_ingredient')
export class ActiveIngredient {
  @PrimaryGeneratedColumn('uuid')
  ingredient_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ingredient_name!: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  hazard_level!: string;

  @Column({ type: 'boolean', default: true, nullable: true })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // một thành phần có thể có nhiều sản phẩm thông qua product_ingredient
  @OneToMany(
    () => ProductIngredient,
    (productIngredient) => productIngredient.ingredient,
    {
      nullable: true,
    },
  )
  product_ingredients: ProductIngredient[];
}
