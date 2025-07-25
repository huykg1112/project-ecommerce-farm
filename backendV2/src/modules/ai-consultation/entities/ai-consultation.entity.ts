import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Disease } from '../../disease/entities/disease.entity';
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

  @Column({ type: 'varchar', length: 50, nullable: true })
  severity_level?: string; // Mức độ nghiêm trọng (nhẹ/trung bình/nặng)

  @Column({ type: 'simple-array', nullable: true })
  recommended_name_products?: string; // đoạn văn sản phẩm đề xuất, mỗi sản phẩm cách nhau bởi dấu phẩy

  @Column({ type: 'int', nullable: true })
  treatment_duration?: number; // Thời gian điều trị (số ngày)

  @Column({ type: 'simple-array', nullable: true })
  prevention_tips?: string; // đoạn văn mẹo phòng ngừa, mỗi mẹo cách nhau bởi dấu phẩy

  @Column({ type: 'simple-array', nullable: true })
  monitoring_signs?: string; // đoan văn dấu hiệu cần theo dõi, mỗi dấu hiệu cách nhau bởi dấu phẩy

  @Column({ type: 'boolean', default: false, nullable: true })
  is_deleted!: boolean;

  @ManyToOne(() => User, (user) => user.ai_consultations, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToOne(() => Disease, { nullable: true })
  @JoinColumn({ name: 'disease_id' })
  disease!: Disease;

  @OneToMany(
    () => TreatmentPlan,
    (treatmentPlan) => treatmentPlan.consultation,
    {
      nullable: true,
    },
  )
  treatment_plans: TreatmentPlan[];
}
