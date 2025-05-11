import { CartItem } from '@modules/cart_items/entities/cart_item.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { FavoriteProduct } from '@modules/favorite_products/entities/favorite_product.entity';
import { Ingredient } from '@modules/ingredients/entities/ingredient.entity';
import { OrderItem } from '@modules/order_items/entities/order_item.entity';
import { ProductBatch } from '@modules/product_batches/entities/product_batch.entity';
import { ProductImage } from '@modules/product_images/entities/product_image.entity';
import { Review } from '@modules/reviews/entities/review.entity';
import { User } from '@modules/users/entities/user.entity';
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

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @Column({ nullable: true })
  image: string;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column('int', { default: 0 })
  totalSales: number;

  @Column('boolean', { default: false })
  isFeatured: boolean;

  @Column('text', { nullable: true })
  usageInstructions: string; // Hướng dẫn sử dụng

  @Column('text', { nullable: true })
  safetyInstructions: string; // Hướng dẫn an toàn

  @Column('text', { nullable: true })
  storageInstructions: string; // Hướng dẫn bảo quản

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.products)
  @JoinTable()
  ingredients: Ingredient[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(
    () => FavoriteProduct,
    (favoriteProduct) => favoriteProduct.product,
  )
  favorites: FavoriteProduct[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.products)
  distributor!: User; // Người bán (đại lý)

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable() // Tạo bảng trung gian product_categories
  categories!: Category[]; // Một Product có thể thuộc nhiều Category

  @OneToMany(() => ProductImage, (image) => image.product)
  images!: ProductImage[]; // Một Product có nhiều ProductImage

  @OneToMany(() => ProductBatch, (batch) => batch.product)
  batches!: ProductBatch[]; // Một Product có nhiều ProductBatch
}
