import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AiConsultation } from '../../ai-consultation/entities/ai-consultation.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('treatment_plan')
export class TreatmentPlan {
  @PrimaryGeneratedColumn('uuid')
  treatment_plan_id: string;

  @ManyToOne(() => AiConsultation, { nullable: true })
  @JoinColumn({ name: 'consultation_id' })
  consultation!: AiConsultation;

  @Column({ type: 'int', nullable: true })
  day_number!: number;

  @Column({ type: 'text' })
  treatment_instruction!: string;

  @Column({ type: 'text', nullable: true })
  dosage_instruction!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  frequency!: string;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;
}
