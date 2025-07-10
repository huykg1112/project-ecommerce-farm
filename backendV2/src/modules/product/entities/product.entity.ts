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
import { Category } from '../../category/entities/category.entity';
import { Manufacturer } from '../../manufacturer/entities/manufacturer.entity';
import { ProductIngredient } from '../../product-ingredient/entities/product-ingredient.entity';
import { ProductDisease } from '../../product_disease/entities/product_disease.entity';
import { Review } from '../../review/entities/review.entity';
import { User } from '../../user/entities/user.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  product_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'distributor_id' })
  distributor: User;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: 'product_category' }) // Bảng trung gian
  categories: Category[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  product_name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'text', nullable: true })
  usage_instructions!: string;

  @Column({ type: 'boolean', default: true, nullable: true })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @Column({ type: 'float', nullable: false, default: 0 })
  unit_product_price: number;

  // một sản phẩm có nhiều review thông qua review
  @OneToMany(() => Review, (review) => review.product, {
    nullable: true,
  })
  reviews: Review[];

  // một sản phẩm chứa nhiều thành phần thông qua product_ingredient
  @OneToMany(
    () => ProductIngredient,
    (productIngredient) => productIngredient.product,
    {
      nullable: true,
    },
  )
  product_ingredients: ProductIngredient[];

  @OneToMany(() => ProductDisease, (pd) => pd.product, { nullable: true })
  productDiseases: ProductDisease[];

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.products)
  manufacturer!: Manufacturer;
}
