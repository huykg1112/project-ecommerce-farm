import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AiConsultation } from '../../ai-consultation/entities/ai-consultation.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('treatment_plan')
export class TreatmentPlan {
      @PrimaryGeneratedColumn('uuid')
      treatment_plan_id: string;

      @ManyToOne(() => AiConsultation)
      @JoinColumn({ name: 'consultation_id' })
      consultation!: AiConsultation;

      @Column({ type: 'int', nullable: true })
      day_number!: number;

      @Column({ type: 'text' })
      treatment_instruction!: string;

      @ManyToOne(() => Product)
      @JoinColumn({ name: 'product_id' })
      product!: Product;

      @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      created_at!: Date;
}
