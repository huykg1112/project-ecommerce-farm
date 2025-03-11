import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { RolePermissionService } from '../role_permissions/role_permissions.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permissionsService: PermissionsService,
    private readonly rolePermissionService: RolePermissionService, // Lý do: Chuẩn hóa tên biến
  ) {}

  async findById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException(`Không tìm thấy role với id ${id}`);
    }
    return role;
  }

  async findByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ name });
    if (!role) {
      throw new NotFoundException(`Không tìm thấy role với name ${name}`);
    }
    return role;
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, description } = createRoleDto;
    const existingRole = await this.roleRepository.findOne({ where: { name } });
    if (existingRole) {
      throw new BadRequestException(`Role ${name} đã tồn tại`); // Lý do: Dùng BadRequest thay NotFound cho ngữ nghĩa đúng
    }
    const role = this.roleRepository.create({ name, description }); // Lý do: Dùng create để gọn hơn
    const savedRole = await this.roleRepository.save(role);

    if (name.toLowerCase() === 'admin') {
      const allPermissions = await this.permissionsService.findAll();
      await Promise.all(
        allPermissions.map((permission) =>
          this.rolePermissionService.addPermissionToRole(
            savedRole.id,
            permission.id,
          ),
        ),
      );
    }
    return savedRole;
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      select: ['id', 'name', 'description', 'isActive'], // Lý do: Chỉ lấy các trường cần thiết để giảm tải
    });
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findById(id);
    // Lý do: Kiểm tra name trùng lặp khi cập nhật
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });
      if (existingRole && existingRole.id !== id) {
        throw new BadRequestException(`Role ${updateRoleDto.name} đã tồn tại`);
      }
    }
    Object.assign(role, updateRoleDto); // Lý do: Dùng Object.assign để gọn gàng hơn
    return this.roleRepository.save(role);
  }

  // Bật hoặc tắt trạng thái của Role
  async toggleActive(id: string): Promise<Role> {
    const role = await this.findById(id);
    role.isActive = !role.isActive;
    return this.roleRepository.save(role);
  }

  // Xóa Role
  async deleteRole(id: string): Promise<void> {
    const role = await this.findById(id);
    // Xóa các rolePermissions trước khi xóa role để tránh lỗi quan hệ
    await this.rolePermissionService
      .findByRoleId(id)
      .then((rolePermissions) =>
        Promise.all(
          rolePermissions.map((rp) =>
            this.rolePermissionService.removePermissionFromRole(
              id,
              rp.permission.id,
            ),
          ),
        ),
      );
    await this.roleRepository.remove(role);
  }

  // Lấy tất cả RolePermission của Role
  async getRolePermissions(id: string): Promise<{ role: Role }> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });
    if (!role) {
      throw new NotFoundException(`Không tìm thấy role với id ${id}`);
    }
    return { role };
  }

  async assignPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<Role> {
    const role = await this.findById(roleId);
    const permission = await this.permissionsService.findById(permissionId);
    if (!permission) {
      throw new NotFoundException(
        `Không tìm thấy permission với id ${permissionId}`,
      );
    }
    await this.rolePermissionService.addPermissionToRole(roleId, permissionId);
    return role;
  }
}
