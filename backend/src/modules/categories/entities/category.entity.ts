import { Product } from '@modules/product/entities/product.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  imageURL!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  imagePublicId: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @ManyToMany(() => Product, (product) => product.categories)
  @JoinColumn() // Required for ManyToMany
  products!: Product[]; // Một Category có thể chứa nhiều Product
}
