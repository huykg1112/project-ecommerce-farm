import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IngredientDisease } from '../../ingredient-disease/entities/ingredient-disease.entity';

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

  // một bệnh có thể có nhiều thành phần đặt trị thông qua active_ingredient
  @OneToMany(() => IngredientDisease, (id) => id.ingredient)
  ingredientDiseases: IngredientDisease[];
}
