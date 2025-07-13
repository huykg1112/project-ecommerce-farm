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
  product!: Product;

  @ManyToOne(() => User, (user) => user.reviews, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => User, { nullable: true }) // Distributor phản hồi
  @JoinColumn({ name: 'distributor_id' })
  distributor!: User;

  @OneToOne(() => Review, { nullable: true }) // Phản hồi từ distributor
  @JoinColumn({ name: 'parent_review_id' })
  parent_review!: Review;

  @OneToOne(() => Review, (review) => review.parent_review) // Liên kết đến phản hồi distributor
  distributor_response_review!: Review;

  @Column({ type: 'int', nullable: true })
  rating!: number;

  @Column({ type: 'text', nullable: true })
  comment!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_deleted!: boolean;
}
