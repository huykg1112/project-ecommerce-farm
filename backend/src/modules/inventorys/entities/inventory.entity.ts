import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductBatch } from '../../product_batches/entities/product_batch.entity';
import { User } from '../../users/entities/user.entity';

@Entity('inventorys')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  nameStore: string;

  @Column({ nullable: true })
  addressStore: string;

  @Column({ nullable: true })
  imageStore: string;

  @Column({ nullable: true })
  imageStorePublicId: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  lat!: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  lng!: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @ManyToOne(() => User, (user) => user.inventory)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ProductBatch, (batch) => batch.inventory) // Một Inventory chứa nhiều ProductBatch
  productBatches!: ProductBatch[];

}
