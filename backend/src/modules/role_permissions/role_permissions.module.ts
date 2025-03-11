import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { RolePermission } from './entities/role_permission.entity';
import { RolePermissionsController } from './role_permissions.controller';
import { RolePermissionService } from './role_permissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission, Role, Permission])],
  controllers: [RolePermissionsController],
  providers: [RolePermissionService],
  exports: [RolePermissionService],
})
export class RolePermissionsModule {}
