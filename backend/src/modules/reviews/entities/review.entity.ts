import { Product } from '@modules/products/entities/product.entity';
import { User } from '@modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int', default: 0, nullable: true })
  rating!: number;

  @Column({ type: 'text', default: '', nullable: true })
  comment!: string;

  @Column({ type: 'timestamp' })
  reviewDate!: Date;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.reviews)
  user!: User;

  @ManyToOne(() => Product, (product) => product.reviews)
  product!: Product;
}
