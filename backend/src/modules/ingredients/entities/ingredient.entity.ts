import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  effects: string; // Công dụng

  @Column('text')
  warnings: string; // Cảnh báo nguy hiểm

  @Column('text', { nullable: true })
  chemicalFormula: string; // Công thức hóa học

  @Column('text', { nullable: true })
  toxicityLevel: string; // Mức độ độc hại

  @Column('text', { nullable: true })
  usageInstructions: string; // Hướng dẫn sử dụng

  @ManyToMany(() => Product, product => product.ingredients)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 