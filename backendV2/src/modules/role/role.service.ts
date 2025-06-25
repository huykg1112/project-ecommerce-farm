import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  //lấy tất cả vai trò
  async findAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  //tìm vai trò bằng id nếu không tồn tại trả về null
  async findRoleById(id: string): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { role_id: id } });
  }
  //tìm vai trò bằng tên nếu không tồn tại trả về null
  async findRoleByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { role_name: name } });
  }

  //tạo vai trò
  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { role_name, description } = createRoleDto;
    //kiểm tra tên vai trò đã tồn tại chưa
    const existingRole = await this.findRoleByName(role_name);
    if (existingRole) {
      throw new BadRequestException('Tên vai trò đã tồn tại');
    }
    //tạo vai trò mới
    const newRole = this.roleRepository.create({
      role_name,
      description,
    });
    return this.roleRepository.save(newRole);
  }

  // xóa vai trò
  async deleteRole(id: string): Promise<void> {
    const role = await this.findRoleById(id);
    if (!role) {
      throw new NotFoundException('Vai trò không tồn tại');
    }
    await this.roleRepository.delete(id);
  }
}
