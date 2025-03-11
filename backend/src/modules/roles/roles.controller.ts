import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  //Lấy Role theo ID

  @Get('id/:id')
  async findById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }
    return this.rolesService.findById(id);
  }

  //Lấy Role theo Name

  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    return this.rolesService.findByName(name);
  }
  //Lấy tất cả Role

  @Get('all')
  async findAll() {
    return this.rolesService.findAll();
  }

  //Tạo Role

  @Post('create')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  //Cập nhật Role

  @Put('update/:id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    if (!isUUID(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  //Bật hoặc tắt trạng thái của Role

  @Patch('toggle-active/:id')
  async toggleActive(@Param('id') id: string): Promise<{ message: string }> {
    if (!isUUID(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }
    const role = await this.rolesService.toggleActive(id);
    return {
      message: role.isActive ? 'Role đã được kích hoạt' : 'Role đã được tắt',
    };
  }

  //Xóa Role

  @Delete('delete/:id')
  async deleteRole(@Param('id') id: string): Promise<{ message: string }> {
    await this.rolesService.deleteRole(id);
    return { message: 'Role đã được xóa' };
  }

  //Lấy tất cả RolePermission của Role

  @Get('role-permissions/:id')
  async getRolePermissions(@Param('id') id: string) {
    return this.rolesService.getRolePermissions(id);
  }

  //Thêm Permission vào Role

  @Post('assign-permission')
  async assignPermissionToRole(
    @Body('roleId') roleId: string,
    @Body('permissionId') permissionId: string,
  ) {
    if (!isUUID(roleId) || !isUUID(permissionId)) {
      throw new NotFoundException('Invalid roleId or permissionId format');
    }
    return this.rolesService.assignPermissionToRole(roleId, permissionId);
  }
}
