import { Permission } from '@modules/permissions/entities/permission.entity';
import { Role } from '@modules/roles/entities/role.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['role', 'permission'])
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
  }) // Lý do: Thêm onDelete để đồng bộ xóa
  role!: Role;

  @ManyToOne(() => Permission, { onDelete: 'CASCADE' })
  permission!: Permission;
}
