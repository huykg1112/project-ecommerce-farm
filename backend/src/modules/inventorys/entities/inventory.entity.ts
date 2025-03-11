import { ProductBatch } from '@modules/product_batches/entities/product_batch.entity';
import { User } from '@modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int' })
  quantityInStock!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location!: string; // Vị trí kho của đại lý

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @OneToOne(() => User, (user) => user.inventory)
  distributor!: User; // Một Inventory chỉ thuộc 1 User

  @OneToMany(() => ProductBatch, (batch) => batch.inventory) // Một Inventory chứa nhiều ProductBatch
  productBatches!: ProductBatch[];
}
