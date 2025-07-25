import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../user/entities/user.entity';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  review_id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product; // Sản phẩm được đánh giá

  @ManyToOne(() => User, (user) => user.reviews, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user!: User; // Người dùng đã đánh giá (đánh giá 1 lần duy nhất)

  @ManyToOne(() => User, { nullable: true }) // Distributor phản hồi
  @JoinColumn({ name: 'distributor_id' })
  distributor!: User; // Distributor đã phản hồi đánh giá trong parent_review (phản hồi của đánh giá 1 lần duy nhất)

  @OneToOne(() => Review, { nullable: true }) // Phản hồi từ distributor
  @JoinColumn({ name: 'parent_review_id' })
  parent_review!: Review; // review gốc nếu đây là review phản hồi

  @OneToOne(() => Review, (review) => review.parent_review) // Liên kết đến phản hồi distributor
  distributor_response_review!: Review;

  @Column({ type: 'int', nullable: true })
  rating!: number; // Đánh giá từ 1 đến 5 dành cho khách hàng

  @Column({ type: 'text', nullable: true })
  comment!: string; // Bình luận của người dùng và phảm hồi của distributor

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_deleted!: boolean;
}
