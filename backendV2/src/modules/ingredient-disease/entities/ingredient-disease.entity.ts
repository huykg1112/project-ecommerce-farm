import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ActiveIngredient } from '../../active-ingredient/entities/active-ingredient.entity';
import { Disease } from '../../disease/entities/disease.entity';

@Entity('ingredient_disease')
export class IngredientDisease {
  @PrimaryColumn('uuid')
  ingredient_id: string;

  @PrimaryColumn('uuid')
  disease_id: string;

  @ManyToOne(() => ActiveIngredient)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient!: ActiveIngredient;

  @ManyToOne(() => Disease)
  @JoinColumn({ name: 'disease_id' })
  disease!: Disease;

  @Column({ type: 'text', nullable: true })
  effectiveness_description!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
