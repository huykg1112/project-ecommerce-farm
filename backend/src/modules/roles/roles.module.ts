// src/modules/roles/roles.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolePermissionsModule } from '../role_permissions/role_permissions.module';
import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    forwardRef(() => PermissionsModule),
    forwardRef(() => RolePermissionsModule),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService], // Critical: Ensures RolesService is available to other modules
})
export class RolesModule {}
