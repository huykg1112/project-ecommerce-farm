import { Category } from '@modules/categories/entities/category.entity';
import { FavoriteProduct } from '@modules/favorite_products/entities/favorite_product.entity';
import { OrderItem } from '@modules/order_items/entities/order_item.entity';
import { ProductBatch } from '@modules/product_batches/entities/product_batch.entity';
import { ProductImage } from '@modules/product_images/entities/product_image.entity';
import { Review } from '@modules/reviews/entities/review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'text', default: '', nullable: true })
  description!: string;

  @Column({
    type: 'decimal',
    default: 0.0,
    precision: 10,
    scale: 2,
    nullable: true,
  }) // decimal là kiểu dữ liệu sô thực, precision là tổng số chữ số, scale là số chứ số sau dấu phẩy
  price!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.products)
  distributor!: User; // Người bán (đại lý)

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable() // Tạo bảng trung gian product_categories
  categories!: Category[]; // Một Product có thể thuộc nhiều Category

  @OneToMany(() => ProductImage, (image) => image.product)
  images!: ProductImage[]; // Một Product có nhiều ProductImage

  @OneToMany(() => ProductBatch, (batch) => batch.product)
  batches!: ProductBatch[]; // Một Product có nhiều ProductBatch

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[]; // Một Product có nhiều OrderItem

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => FavoriteProduct, (favorite) => favorite.product)
  favorites: FavoriteProduct[];
}
