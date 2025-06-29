import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ILike, Repository } from 'typeorm';

import { UserProfileType } from '@root/src/serializers/TypeSerializer/UserProfile.type';
import { UserProfileSerializer } from '@root/src/serializers/UserSerializers';
import { AddressService } from '../address/address.service';
import { RoleService } from '../role/role.service';
import { TokenService } from '../token/token.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly saltRounds: number;
  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    public readonly tokenService: TokenService,
    public readonly rolesService: RoleService,
    private readonly addressService: AddressService,
  ) {
    this.saltRounds = Number(
      this.configService.get<number>('BCRYPT_SALT_ROUNDS') ?? 10,
    );
    if (isNaN(this.saltRounds)) {
      throw new Error('BCRYPT_SALT_ROUNDS must be a number'); // Lý do: Ném lỗi ngay constructor để phát hiện sớm
    }
  }
  findByKeyword(keyword: string): Promise<User[]> {
    return this.userRepository.find({
      where: [
        { full_name: ILike(`%${keyword}%`) }, //ILike là tìm kiếm tương đối
        { email: ILike(`%${keyword}%`) },
        { phone_number: ILike(`%${keyword}%`) },
        { username: ILike(`%${keyword}%`) },
      ],
    });
  }
  // kiểm tra username đã tồn tại chưa nếu tồn tại trả về true
  async checkUsernameExists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    return !!user;
  }
  // kiểm tra email đã tồn tại chưa nếu tồn tại trả về true
  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }
  // tìm user bằng id
  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { user_id: id },
      relations: ['role', 'addresses'],
      order: { addresses: { is_default: 'DESC', created_at: 'DESC' } },
    });
  }

  // lưu user
  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  // đăng ký người dùng
  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const { username, email, password, full_name, phone_number, avatar } =
      registerUserDto;

    // kiểm tra username và email đã tồn tại chưa
    if (
      (await this.checkUsernameExists(username)) ||
      (await this.checkEmailExists(email))
    ) {
      throw new BadRequestException('Username hoặc email đã tồn tại');
    }
    // mã hóa password
    const saltRounds = Number(
      this.configService.get<number>('BCRYPT_SALT_ROUNDS'),
    );
    if (isNaN(saltRounds)) {
      throw new Error('BCRYPT_SALT_ROUNDS phải là số');
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Tìm hoặc tạo vai trò mặc định "Client"
    let defaultRole = await this.rolesService.findRoleByName('Client');
    if (!defaultRole) {
      //tạo vai trò mặc định
      const newRole = await this.rolesService.createRole({
        role_name: 'Client',
        description: 'Vai trò mặc định',
      });
      defaultRole = newRole;
    }
    // tạo user mới
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      full_name,
      phone_number,
      avatar,
      role: defaultRole,
    });

    return this.saveUser(user);
  }
  // cập nhật thông tin người dùng
  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<{ message: string; user: UserProfileType }> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    // kiểm tra email đã tồn tại chưa
    // if (updateProfileDto.email) {
    //   const existingUser = await this.checkEmailExists(updateProfileDto.email);
    //   if (existingUser) {
    //     throw new BadRequestException('Email đã tồn tại');
    //   }
    // }
    // cập nhật thông tin người dùng
    Object.assign(user, {
      full_name: updateProfileDto.full_name,
      email: updateProfileDto.email,
      phone_number: updateProfileDto.phone_number,
      avatar: updateProfileDto.avatar,
      is_active: updateProfileDto.is_active,
      cccd: updateProfileDto.cccd,
    });
    // Xử lý cập nhật địa chỉ nếu có thay đổi
    if (
      updateProfileDto.address ||
      updateProfileDto.lat ||
      updateProfileDto.lng
    ) {
      // Lấy địa chỉ mặc định hiện tại
      const addresses = Array.isArray(user.addresses) ? user.addresses : [];
      const defaultAddress = addresses.find((a) => a.is_default);
      // Kiểm tra nếu có thay đổi địa chỉ
      const isAddressChanged =
        !defaultAddress ||
        defaultAddress.address_detail !== updateProfileDto.address ||
        defaultAddress.latitude !== updateProfileDto.lat ||
        defaultAddress.longitude !== updateProfileDto.lng;
      if (isAddressChanged) {
        // Nếu có defaultAddress thì update, không thì tạo mới
        if (defaultAddress) {
          await this.addressService.update(
            user.user_id,
            defaultAddress.address_id,
            {
              address_detail: updateProfileDto.address,
              latitude: updateProfileDto.lat,
              longitude: updateProfileDto.lng,
              is_default: true,
            },
          );
        } else {
          await this.addressService.create(user.user_id, {
            address_detail: updateProfileDto.address,
            latitude: updateProfileDto.lat,
            longitude: updateProfileDto.lng,
            is_default: true,
          });
        }
      }
    }
    const updatedUser = await this.saveUser(user);
    console.log('updatedUser', updatedUser);
    // Lấy lại user với relations để trả về đúng dữ liệu
    const userWithRelations = await this.findUserById(updatedUser.user_id);
    if (!userWithRelations) {
      throw new NotFoundException('Người dùng không tồn tại sau khi cập nhật');
    }
    return {
      message: 'Cập nhật thông tin người dùng thành công',
      user: UserProfileSerializer.serialize(userWithRelations),
    };
  }
  // xóa người dùng
  async removeUser(id: string): Promise<{ message: string }> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    await this.userRepository.remove(user);
    return { message: 'Xóa người dùng thành công' };
  }
  // lấy tất cả người dùng
  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getProfile(id: string): Promise<UserProfileType> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    return UserProfileSerializer.serialize(user);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    return user;
  }
  // đổi mật khẩu
  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string; user: UserProfileType }> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    // kiểm tra mật khẩu cũ
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.old_password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }
    // mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.new_password,
      this.saltRounds,
    );
    // cập nhật mật khẩu
    user.password = hashedPassword;
    const updatedUser = await this.saveUser(user);
    return {
      message: 'Đổi mật khẩu thành công',
      user: UserProfileSerializer.serialize(updatedUser),
    };
  }
}
