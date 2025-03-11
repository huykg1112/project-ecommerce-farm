import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { RolePermissionService } from '../role_permissions/role_permissions.service'; // Sửa đường dẫn nếu cần
import { Role } from '../roles/entities/role.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly rolePermissionService: RolePermissionService,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    const { name, description, isActive } = createPermissionDto;
    const existingPermission = await this.permissionRepository.findOne({
      where: { name },
    });
    if (existingPermission) {
      throw new BadRequestException(`Permission ${name} đã tồn tại`);
    }
    const permission = this.permissionRepository.create({
      name,
      description,
      isActive: isActive !== undefined ? isActive : true,
    });
    const savedPermission = await this.permissionRepository.save(permission);

    // Tự động gán permission cho vai trò "Admin"
    try {
      const adminRole = await this.rolesRepository.findOne({
        where: { name: 'Admin' },
      });
      if (!adminRole) {
        throw new NotFoundException('Role Admin not found');
      }
      await this.rolePermissionService.addPermissionToRole(
        adminRole.id,
        savedPermission.id,
      );
    } catch (error) {
      // Nếu không tìm thấy role "Admin", bỏ qua lỗi này (hoặc xử lý theo cách bạn muốn)
      console.log('Role Admin not found, skipping assignment:', error.message);
    }

    return savedPermission;
  }

  async updatePermission(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findById(id);
    if (
      updatePermissionDto.name &&
      updatePermissionDto.name !== permission.name
    ) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: updatePermissionDto.name },
      });
      if (existingPermission && existingPermission.id !== id) {
        throw new BadRequestException(
          `Permission ${updatePermissionDto.name} đã tồn tại`,
        );
      }
    }
    Object.assign(permission, updatePermissionDto);
    return this.permissionRepository.save(permission);
  }

  async toggleActive(id: string): Promise<Permission> {
    const permission = await this.findById(id);
    permission.isActive = !permission.isActive;
    return this.permissionRepository.save(permission);
  }

  async deletePermission(id: string): Promise<void> {
    const permission = await this.findById(id);
    const rolePermissions =
      await this.rolePermissionService.findByPermissionId(id);
    await Promise.all(
      rolePermissions.map((rp) =>
        this.rolePermissionService.removePermissionFromRole(rp.role.id, id),
      ),
    );
    await this.permissionRepository.remove(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find({
      select: ['id', 'name', 'description', 'isActive'], //  Chỉ lấy các trường cần thiết để giảm tải
    });
  }

  async findById(id: string): Promise<Permission> {
    if (!isUUID(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException(`Không tìm thấy permission với id ${id}`);
    }
    return permission;
  }

  async findByName(name: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOneBy({ name });
    if (!permission) {
      throw new NotFoundException(`Không tìm thấy permission với name ${name}`);
    }
    return permission;
  }
}
