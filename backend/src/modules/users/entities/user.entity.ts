import { CartItem } from '@modules/cart_items/entities/cart_item.entity';
import { FavoriteProduct } from '@modules/favorite_products/entities/favorite_product.entity';
import { Inventory } from '@modules/inventorys/entities/inventory.entity';
import { Order } from '@modules/orders/entities/order.entity';
import { Review } from '@modules/reviews/entities/review.entity';
import { Role } from '@modules/roles/entities/role.entity';
import { Token } from '@modules/tokens/entities/token.entity'; // Thêm import
import { Product } from '@root/src/modules/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  username!: string;

  @Column({ type: 'varchar', length: 100 })
  password!: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullName!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone!: string;

  @Column({ type: 'varchar', length: 12, nullable: true })
  cccd!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address!: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  lat!: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  lng!: number;

  //giấy phép kinh doanh
  @Column({ type: 'varchar', length: 255, nullable: true })
  license!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar!: string;

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' }) // Chỉ định khóa ngoại nằm ở bảng User
  role!: Role;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[];

  @OneToMany(() => FavoriteProduct, (favorite) => favorite.user)
  favorites!: FavoriteProduct[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems!: CartItem[];

  @OneToMany(() => Product, (product) => product.distributor)
  products!: Product[];

  @OneToOne(() => Inventory, (inventory) => inventory.distributor)
  @JoinColumn()
  inventory!: Inventory;

  @OneToMany(() => Token, (token) => token.user) // Quan hệ OneToMany với Token
  tokens!: Token[];
}
