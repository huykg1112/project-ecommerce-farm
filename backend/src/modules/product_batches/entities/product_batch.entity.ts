import { Product } from '@modules/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Inventory } from '../../inventorys/entities/inventory.entity';

@Entity()
export class ProductBatch {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  batchCode!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'timestamp' })
  productionDate!: Date;

  @Column({ type: 'timestamp' })
  expiryDate!: Date;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @ManyToOne(() => Product, (product) => product.batches)
  product!: Product; // Một ProductBatch chỉ thuộc 1 Product

  @ManyToOne(() => Inventory, (inventory) => inventory.productBatches)
  inventory!: Inventory; // Một ProductBatch chỉ thuộc 1 Inventory
}
