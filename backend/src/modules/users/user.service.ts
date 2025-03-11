import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '../roles/dto/create-role.dto';
import { RolesService } from '../roles/roles.service';
import { TokensService } from '../tokens/tokens.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly saltRounds: number; // Lý do: Cache saltRounds để tăng tốc độ
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly tokenService: TokensService,
    private readonly rolesService: RolesService,
  ) {
    this.saltRounds = Number(
      this.configService.get<number>('BCRYPT_SALT_ROUNDS') ?? 10,
    );
    if (isNaN(this.saltRounds)) {
      throw new Error('BCRYPT_SALT_ROUNDS must be a number'); // Lý do: Ném lỗi ngay constructor để phát hiện sớm
    }
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy user với username ${username}`,
      );
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'], // Tải mối quan hệ role
    });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy user với id ${id}`);
    }
    return user;
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { username, email, password, fullName, phone, address, avatar } =
      registerUserDto;

    // Kiểm tra username hoặc email đã tồn tại
    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUsername) {
      throw new BadRequestException('Username đã được sử dụng');
    }
    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new BadRequestException('Email đã được sử dụng');
    }
    // Mã hóa mật khẩu
    const saltRounds = Number(
      this.configService.get<number>('BCRYPT_SALT_ROUNDS'),
    );
    if (isNaN(saltRounds)) {
      throw new BadRequestException('BCRYPT_SALT_ROUNDS phải là số');
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tìm hoặc tạo vai trò mặc định "Client"
    let role = await this.rolesService.findByName('Client');
    if (!role) {
      const createRoleDto: CreateRoleDto = {
        name: 'Client',
        description: 'Vai trò mặc định cho khách hàng',
      };
      role = await this.rolesService.createRole(createRoleDto);
    }

    // Tạo user mới và gán vai trò "Client"
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      phone,
      address,
      avatar,
      isActive: true,
      role, // Gán role trực tiếp
    });

    // Lưu user mà không cần lo lắng về phía ngược (Role.users)
    return this.userRepository.save(newUser);
  }

  async updateUserProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<{ message: string }> {
    const user = await this.findById(userId);

    // Lý do: Kiểm tra email trùng lặp khi cập nhật
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateProfileDto.email },
      });
      if (existingEmail && existingEmail.id !== userId) {
        throw new BadRequestException(
          'Email đã được sử dụng bởi người dùng khác',
        );
      }
    }

    const { fullName, email, phone, address, isActive, avatar } =
      updateProfileDto;
    Object.assign(user, { fullName, email, phone, address, isActive, avatar }); //

    await this.userRepository.save(user);
    return { message: 'Cập nhật thông tin thành công' };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    currentAccessToken: string,
  ): Promise<{ message: string }> {
    const user = await this.findById(userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    const saltRounds = Number(
      this.configService.get<number>('BCRYPT_SALT_ROUNDS'),
    );
    if (isNaN(saltRounds)) {
      throw new BadRequestException('BCRYPT_SALT_ROUNDS phải là số');
    }
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await this.userRepository.save(user);

    await this.tokenService.deleteAllExceptCurrent(user.id, currentAccessToken);

    return { message: 'Đổi mật khẩu thành công' };
  }

  async assignRole(
    userId: string,
    assignRoleDto: AssignRoleDto,
  ): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(
        `Người dùng với ID ${userId} không được tìm thấy`,
      );
    }

    const role = await this.rolesService.findById(assignRoleDto.roleId);
    if (!role || !role.isActive) {
      throw new BadRequestException(
        `Vai trò với ID ${assignRoleDto.roleId} không hợp lệ hoặc đã bị khóa`,
      );
    }

    user.role = role;
    return this.userRepository.save(user);
  }

  async getUserRole(
    userId: string,
  ): Promise<{ role: { id: string; name: string } }> {
    const user = await this.findById(userId);
    return { role: { id: user.role.id, name: user.role.name } };
  }

  async removeRole(userId: string): Promise<User> {
    const user = await this.findById(userId);
    const roleClient = await this.rolesService.findByName('Client');
    if (!roleClient) {
      throw new NotFoundException('Vai trò Client không tồn tại'); // Lý do: Kiểm tra role mặc định
    }
    user.role = roleClient;
    return this.userRepository.save(user);
  }
}
