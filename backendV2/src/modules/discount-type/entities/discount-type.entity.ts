import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('discount_type')
export class DiscountType {
  @PrimaryGeneratedColumn('uuid')
  discount_type_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type_name!: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true, nullable: true })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}
