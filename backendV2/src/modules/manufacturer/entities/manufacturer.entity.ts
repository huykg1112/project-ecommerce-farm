import { Product } from '@modules/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('manufacturer')
export class Manufacturer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logoPublicId!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted!: boolean;

  @OneToMany(() => Product, (product) => product.manufacturer)
  products!: Product[]; // Một Manufacturer có thể có nhiều Product
}
