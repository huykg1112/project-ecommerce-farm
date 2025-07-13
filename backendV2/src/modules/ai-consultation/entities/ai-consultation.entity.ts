import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TreatmentPlan } from '../../treatment-plan/entities/treatment-plan.entity';
import { User } from '../../user/entities/user.entity';

@Entity('ai_consultation')
export class AiConsultation {
  @PrimaryGeneratedColumn('uuid')
  consultation_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  crop_type!: string;

  @Column({ type: 'text', nullable: true })
  symptom_description!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  growth_stage!: string;

  @Column({ type: 'text', nullable: true })
  recommended_treatment!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false, nullable: true })
  is_deleted!: boolean;

  @ManyToOne(() => User, (user) => user.ai_consultations, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(
    () => TreatmentPlan,
    (treatmentPlan) => treatmentPlan.consultation,
    {
      nullable: true,
    },
  )
  treatment_plans: TreatmentPlan[];
}
