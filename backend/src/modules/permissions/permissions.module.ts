// src/modules/permissions/permissions.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { Permission } from './entities/permission.entity';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { RolePermissionsModule } from '../role_permissions/role_permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, Role]),
    forwardRef(() => RolePermissionsModule), // Provides RolePermissionService
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
