import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BatchProduct } from '../../batch-product/entities/batch-product.entity';
import { User } from '../../user/entities/user.entity';

@Entity('invenstory')
export class Invenstory {
  @PrimaryGeneratedColumn('uuid')
  invenstory_id: string;

  // Chủ invenstory (user là distributor)
  @OneToOne(() => User, (user) => user.inventory)
  @JoinColumn({ name: 'distributor_id' })
  distributor: User;

  // Tên cửa hàng
  @Column({ type: 'varchar', length: 255 })
  name: string;

  // Giấy phép kinh doanh
  @Column({ type: 'varchar', length: 255 })
  business_license: string;

  // Địa chỉ chi tiết
  @Column({ type: 'varchar', length: 255 })
  invenstory_address: string;

  // Vĩ độ
  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  invenstory_lat: number;

  // Kinh độ
  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  invenstory_lng: number;

  // Ảnh cửa hàng
  @Column({ type: 'varchar', length: 255, nullable: true })
  invenstory_img: string;

  // Một kho hàng có 0 hoăc nhiều lô hàng sản phẩm và 1 lô hàng sản phẩm chỉ thuộc 1 kho hàng
  @OneToMany(() => BatchProduct, (batch_product) => batch_product.invenstory)
  batch_products: BatchProduct[];
}
