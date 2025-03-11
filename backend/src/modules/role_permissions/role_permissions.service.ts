import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { RolePermission } from './entities/role_permission.entity';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async addPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<RolePermission> {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Không tìm thấy role với id ${roleId}`);
    }
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    if (!permission) {
      throw new NotFoundException(
        `Không tìm thấy permission với id ${permissionId}`,
      );
    }
    const existingRolePermission = await this.rolePermissionRepository.findOne({
      where: { role: { id: roleId }, permission: { id: permissionId } },
    });
    if (existingRolePermission) {
      throw new BadRequestException(
        `Permission ${permissionId} đã được gán cho role ${roleId}`,
      );
    }
    const rolePermission = this.rolePermissionRepository.create({
      role,
      permission,
    });
    return this.rolePermissionRepository.save(rolePermission);
  }

  async removePermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: { role: { id: roleId }, permission: { id: permissionId } },
    });
    if (!rolePermission) {
      throw new NotFoundException('RolePermission not found');
    }
    await this.rolePermissionRepository.remove(rolePermission);
  }

  async findByRoleId(roleId: string): Promise<RolePermission[]> {
    return this.rolePermissionRepository.find({
      where: { role: { id: roleId } },
      relations: ['permission'],
      select: ['id', 'createdAt', 'updatedAt'],
    });
  }

  async findByPermissionId(permissionId: string): Promise<RolePermission[]> {
    return this.rolePermissionRepository.find({
      where: { permission: { id: permissionId } },
      relations: ['role'],
      select: ['id', 'createdAt', 'updatedAt'],
    });
  }

  async findByNameRole(name: string): Promise<RolePermission[]> {
    return this.rolePermissionRepository.find({
      where: { role: { name } },
      relations: ['permission'],
    });
  }
}
