import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from '../../address/entities/address.entity';
import { AiConsultation } from '../../ai-consultation/entities/ai-consultation.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Invenstory } from '../../invenstory/entities/invenstory.entity';
import { Order } from '../../order/entities/order.entity';
import { Review } from '../../review/entities/review.entity';
import { Role } from '../../role/entities/role.entity';
import { StoreOwnerRequest } from '../../store_owner_request/entities/store_owner_request.entity';
import { Token } from '../../token/entities/token.entity';
import { Voucher } from '../../voucher/entities/voucher.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';

export enum UserRole {
  ADMIN = 'Admin',
  DISTRIBUTOR = 'Distributor',
  CUSTOMER = 'Client',
}
@Entity('user')
export class User {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Index()
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Index()
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarPublicId?: string; // public_id của ảnh trên Cloudinary

  //cccd
  @Column({ type: 'varchar', length: 12, nullable: true })
  cccd!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_deleted!: boolean;

  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  //1 user có nhiều địa chỉ và 1 địa chỉ chỉ thuộc user đó
  @OneToMany(() => Address, (address) => address.user, {
    nullable: true,
  })
  addresses: Address[];

  // 1 user có nhiều token và 1 token chỉ thuộc user đó
  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  //1 user có nhiều có thể thu thập 0 hoặc nhiều Voucher và 1 Voucher có thể thuộc 0 hoặc nhiều user
  @ManyToMany(() => Voucher, (voucher) => voucher.users, {
    nullable: true,
  })
  @JoinTable({ name: 'user_voucher' }) // Bảng trung gian
  vouchers: Voucher[];

  @OneToOne(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist;

  //1 user có một giỏ hàng và 1 giỏ hàng chỉ thuộc user đó
  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  //1 user có 0 hoặc nhiều review và 1 review chỉ thuộc user đó
  @OneToMany(() => Review, (review) => review.user, {
    nullable: true,
  })
  reviews: Review[];

  //1 user có 0 hoặc nhiều order và 1 order chỉ thuộc user đó
  @OneToMany(() => Order, (order) => order.user, {
    nullable: true,
  })
  orders: Order[];

  //1 user có thể có 0 hoặc 1 request để trở thành store owner
  @OneToOne(
    () => StoreOwnerRequest,
    (store_owner_request) => store_owner_request.user,
    {
      nullable: true,
    },
  )
  store_owner_request: StoreOwnerRequest;

  //1 user có thể có 0 hoặc nhiều ai_consultation và 1 ai_consultation chỉ thuộc user đó
  @OneToMany(() => AiConsultation, (ai_consultation) => ai_consultation.user, {
    nullable: true,
  })
  ai_consultations: AiConsultation[];

  // 1 user là distributor có thể tạo nhiều voucher và 1 voucher chỉ thuộc 1 distributor
  @OneToMany(() => Voucher, (voucher) => voucher.distributor, {
    nullable: true,
  })
  vouchers_distributor: Voucher[];

  //1 user nếu là distributor thi có thể có 1 invenstory ( cũng là cửa hàng của người đó ) và 1 invenstory chỉ thuộc 1 user là distributor
  @OneToOne(() => Invenstory, (invenstory) => invenstory.distributor, {
    nullable: true,
  })
  invenstory: Invenstory;

  // 1 user có 0 hoặc nhiều đơn hàng  order
  @OneToMany(() => Order, (order) => order.user, {
    nullable: true,
  })
  order_details: Order[];

  // 1 user có vai trò là distributor thì có thể có 0 hoặc nhiều order thông qua order
  @OneToMany(() => Order, (order) => order.distributor, {
    nullable: true,
  })
  orders_distributor: Order[];
}
