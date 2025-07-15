import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ILike, Repository } from 'typeorm';

import { CloudinaryService } from '@root/src/cloudinary/cloudinary.service';
import {
  DistributorProfileType,
  UserProfileType,
} from '@root/src/serializers/TypeSerializer/UserProfile.type';
import {
  DistributorProfileSerializer,
  UserProfileSerializer,
} from '@root/src/serializers/UserSerializers';
import { PaginatedResponse } from '@root/src/types/paginatedResponse';
import { AddressService } from '../address/address.service';
import { CreateInvenstoryDto } from '../invenstory/dto/create-invenstory.dto';
import { InvenstoryService } from '../invenstory/invenstory.service';
import { RoleService } from '../role/role.service';
import { TokenService } from '../token/token.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
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
    public readonly invenstoryService: InvenstoryService,
    private readonly cloudinaryService: CloudinaryService,
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
        { is_deleted: false },
      ],
    });
  }
  // kiểm tra username đã tồn tại chưa nếu tồn tại trả về true
  async checkUsernameExists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { username, is_deleted: false },
    });
    return !!user;
  }
  // kiểm tra email đã tồn tại chưa nếu tồn tại trả về true
  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email, is_deleted: false },
    });
    return !!user;
  }
  // tìm user bằng id
  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { user_id: id, is_deleted: false },
      relations: ['role', 'addresses', 'invenstory'],
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
      username: updateProfileDto.username,
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
    if (
      updateProfileDto.role_name &&
      updateProfileDto.role_name !== user.role.role_name
    ) {
      // Nếu có thay đổi vai trò thì gọi hàm changeRole
      const role = await this.rolesService.findRoleByName(
        updateProfileDto.role_name,
      );
      if (!role) {
        throw new NotFoundException('Vai trò không tồn tại');
      }
      await this.changeRole(updatedUser.user_id, role.role_id);
    }

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
    return this.userRepository.find({
      where: { is_deleted: false },
      relations: ['role', 'addresses'],
    });
  }

  async getProfile(
    id: string,
  ): Promise<UserProfileType | DistributorProfileType> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    if (user.role.role_name === 'Distributor') {
      return DistributorProfileSerializer.serialize(user);
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
  // đổi vai trò của người dùng
  async changeRole(id: string, roleId: string): Promise<{ message: string }> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    const role = await this.rolesService.findRoleById(roleId);
    if (!role) {
      throw new NotFoundException('Vai trò không tồn tại');
    }
    // Kiểm tra nếu người dùng đang là Distributor và vai trò mới không phải Distributor
    if (role.role_name !== 'Client') {
      if (!user.invenstory) {
        const userAddress = user.addresses.find(
          (address) => address.is_default,
        );
        const newInvenstory: CreateInvenstoryDto = {
          distributor_id: user.user_id,
          name: user.full_name + "'s Store",
          invenstory_address: userAddress?.address_detail,
          invenstory_lat: userAddress?.latitude,
          invenstory_lng: userAddress?.longitude,
        };
        const createdInvenstory =
          await this.invenstoryService.create(newInvenstory);
        user.invenstory = createdInvenstory;
      } else {
        // Nếu đã có invenstory thì không cần tạo mới mà chuyển is_active sang true
        user.invenstory.is_active = true;
        user.invenstory.distributor = user;
        await this.invenstoryService.updateStatus(
          user.invenstory.invenstory_id,
          true,
        );
      }
    } else {
      // Nếu đổi về Client thì cần tắt invenstory
      if (user.invenstory) {
        user.invenstory.is_active = false;
        await this.invenstoryService.updateStatus(
          user.invenstory.invenstory_id,
          false,
        );
      }
    }
    user.role = role;
    // console.log('Changing role for user:', user);
    await this.saveUser(user);
    return { message: 'Đổi vai trò thành công' };
  }

  // admin Management

  async getUsers(filters: UserFiltersDto): Promise<PaginatedResponse<User>> {
    const { search, role_name, status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    if (search) {
      queryBuilder.where([{ full_name: ILike(`%${search}%`) }]);
    }
    if (role_name) {
      queryBuilder.andWhere('user.role.role_name = :role_name', { role_name });
    }
    if (status) {
      queryBuilder.andWhere('user.is_active = :status', { status });
    }
    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();
    return {
      items,
      total,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUserStatus(id: string): Promise<{ message: string }> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    user.is_active = !user.is_active;
    await this.saveUser(user);
    return { message: 'Cập nhật trạng thái người dùng thành công' };
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    user.is_deleted = true; // Đánh dấu là đã xóa
    await this.saveUser(user);
    return { message: 'Xóa người dùng thành công' };
  }

  async updateAvatar(
    id: string,
    avatarUrl: string,
    publicId: string,
  ): Promise<User> {
    if (!avatarUrl || !publicId) {
      throw new BadRequestException('Avatar URL and Public ID are required');
    }

    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      // Xóa avatar cũ nếu có
      if (user.avatarPublicId) {
        await this.cloudinaryService.deleteImage(user.avatarPublicId);
      }

      // Cập nhật thông tin avatar mới
      user.avatar = avatarUrl;
      user.avatarPublicId = publicId;
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(
        'Failed to update avatar: ' + error.message,
      );
    }
  }
}
