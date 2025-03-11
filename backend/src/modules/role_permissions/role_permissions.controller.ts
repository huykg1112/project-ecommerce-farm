import {
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid'; // Lý do: Thêm kiểm tra UUID
import { RolePermissionService } from './role_permissions.service';

@Controller('roles/:roleId/permissions')
export class RolePermissionsController {
  constructor(private readonly RolePermissionService: RolePermissionService) {}

  @Post(':permissionId')
  async addPermissionToRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    if (!isUUID(roleId)) {
      throw new NotFoundException('Invalid ID format'); // Lý do: Thêm kiểm tra UUID
    }
    return this.RolePermissionService.addPermissionToRole(roleId, permissionId);
  }

  @Delete(':permissionId')
  async removePermissionFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    await this.RolePermissionService.removePermissionFromRole(
      roleId,
      permissionId,
    );
    return { message: 'Permission removed from role successfully' };
  }
}
