import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AiConsultation } from '../../ai-consultation/entities/ai-consultation.entity';
import { ProductDisease } from '../../product_disease/entities/product_disease.entity';

@Entity('disease')
export class Disease {
  @PrimaryGeneratedColumn('uuid')
  disease_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  disease_name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'boolean', default: true, nullable: true })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_deleted!: boolean;

  @OneToMany(() => AiConsultation, (consultation) => consultation.disease, {
    nullable: true,
  })
  aiConsultations: AiConsultation[];

  @OneToMany(() => ProductDisease, (pd) => pd.disease, { nullable: true })
  productDiseases: ProductDisease[];
}
