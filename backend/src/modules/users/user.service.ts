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
  private readonly saltRounds: number;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly tokenService: TokensService,
    private readonly rolesService: RolesService,
  ) {
    this.saltRounds = Number(
      this.configService.get<number>('BCRYPT_SALT_ROUNDS') ?? 10,
    );
    if (isNaN(this.saltRounds))
      throw new Error('BCRYPT_SALT_ROUNDS must be a number');
  }

  async findByUsername(username: string): Promise<User> {
    return this.findUser(
      { username },
      `Không tìm thấy user với username ${username}`,
    );
  }

  async findById(id: string): Promise<User> {
    return this.findUser({ id }, `Không tìm thấy user với id ${id}`);
  }

  async findByEmail(email: string): Promise<User> {
    return this.findUser({ email }, `Không tìm thấy user với email ${email}`);
  }

  async findByEmailInit(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  private async findUser(
    where: Partial<User>,
    errorMessage: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where,
      relations: ['role'],
    });
    if (!user) throw new NotFoundException(errorMessage);
    return user;
  }

  private async ensureClientRole(): Promise<any> {
    let role = await this.rolesService.findByName('Client');
    if (!role) {
      const createRoleDto: CreateRoleDto = {
        name: 'Client',
        description: 'Vai trò mặc định cho khách hàng',
      };
      role = await this.rolesService.createRole(createRoleDto);
    }
    return role;
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { username, email, password, fullName, phone, address, avatar } =
      registerUserDto;

    await this.checkDuplicate(username, email);
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    const role = await this.ensureClientRole();

    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      phone,
      address,
      avatar,
      isActive: true,
      role,
    });

    return this.userRepository.save(newUser);
  }

  async createUserGoogle(email: string, isVerified: boolean): Promise<User> {
    if (await this.findByEmailInit(email)) {
      throw new BadRequestException('Người dùng đã tồn tại');
    }

    const role = await this.ensureClientRole();
    const dummyPassword = await bcrypt.hash(
      email + Date.now(),
      this.saltRounds,
    ); // Tạo mật khẩu ngẫu nhiên

    const newUser = this.userRepository.create({
      email,
      username: email,
      password: dummyPassword,
      isVerified,
      isActive: true,
      role,
    });

    return this.userRepository.save(newUser);
  }

  async updateUserProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<{ message: string }> {
    const user = await this.findById(userId);

    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      if (await this.findByEmailInit(updateProfileDto.email)) {
        throw new BadRequestException(
          'Email đã được sử dụng bởi người dùng khác',
        );
      }
    }

    Object.assign(user, updateProfileDto);
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
    if (oldPassword && !bcrypt.compareSync(oldPassword, user.password)) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    user.password = await bcrypt.hash(newPassword, this.saltRounds);
    await this.userRepository.save(user);
    await this.tokenService.deleteAllExceptCurrent(user.id, currentAccessToken);
    return { message: 'Đổi mật khẩu thành công' };
  }

  async assignRole(
    userId: string,
    assignRoleDto: AssignRoleDto,
  ): Promise<User> {
    const user = await this.findById(userId);
    const role = await this.rolesService.findById(assignRoleDto.roleId);
    if (!role.isActive) throw new BadRequestException('Vai trò đã bị khóa');

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
    user.role = await this.ensureClientRole();
    return this.userRepository.save(user);
  }

  private async checkDuplicate(username: string, email: string): Promise<void> {
    if (await this.userRepository.findOne({ where: { username } })) {
      throw new BadRequestException('Username đã được sử dụng');
    }
    if (await this.userRepository.findOne({ where: { email } })) {
      throw new BadRequestException('Email đã được sử dụng');
    }
  }
}
