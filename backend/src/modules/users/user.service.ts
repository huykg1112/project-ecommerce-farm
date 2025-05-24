import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { InventorysService } from '../inventorys/inventorys.service';
import { CreateRoleDto } from '../roles/dto/create-role.dto';
import { RolesService } from '../roles/roles.service';
import { TokensService } from '../tokens/tokens.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RegisterStoreDto } from './dto/register-store.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserStatisticsDto } from './dto/user-statistics.dto';
import { User } from './entities/user.entity';
import { TimeRangeType, VerificationStatus } from './enums/user-statistics.enum';

@Injectable()
export class UserService {
  private readonly saltRounds: number; // Lý do: Cache saltRounds để tăng tốc độ
  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    public readonly tokenService: TokensService,
    public readonly rolesService: RolesService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly inventorysService: InventorysService,
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
  async isUsernameExists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    return !!user; // Trả về true nếu tồn tại, false nếu không
  }
  async isEmailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
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

    const { fullName, email, phone, address, isActive, avatar, lat, lng, cccd, license } =
      updateProfileDto;
    Object.assign(user, { fullName, email, phone, address, isActive, avatar, lat, lng, cccd, license }); //
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



  async updateAvatar(id: string, avatarUrl: string, publicId: string): Promise<User> {
    if (!avatarUrl || !publicId) {
      throw new BadRequestException('Avatar URL and Public ID are required');
    }

    const user = await this.userRepository.findOne({ where: { id } });
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
      console.error('Update avatar error:', error);
      throw new BadRequestException('Failed to update avatar: ' + error.message);
    }
  }


  async registerStore(registerStoreDto: RegisterStoreDto, userId: string): Promise<User> {
    const { email, fullName, phone, cccd, license, imageStore, imageStorePublicId, addressStore, nameStore, lat, lng } = registerStoreDto;

    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Tìm hoặc tạo vai trò "Store"
    let role = await this.rolesService.findByName('Distributor');

    // Cập nhật user mới với vai trò Distributor
    Object.assign(user, { email, fullName, phone, cccd, license, role });

    const savedUser = await this.userRepository.save(user);

    // Tạo kho/cửa hàng cho đại lý
    await this.inventorysService.create({
      nameStore,
      addressStore,
      userId: savedUser.id,
      lat,
      lng,
      imageStore,
      imageStorePublicId,
    });

    return savedUser;
  }

  // Duyệt chủ đại lý
  async verifyDistributor(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cập nhật trạng thái của user thành "verified"
    user.isVerified = true;
    return this.userRepository.save(user);
  }

  // Hủy duyệt chủ đại lý
  async unverifyDistributor(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cập nhật trạng thái của user thành "unverified"
    user.isVerified = false;
    return this.userRepository.save(user);
  }

  // chặn người dùng
  async blockUser(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cập nhật trạng thái của user thành "blocked"
    user.isActive = false;
    return this.userRepository.save(user);
  }

  // mở khóa người dùng
  async unblockUser(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cập nhật trạng thái của user thành "active"
    user.isActive = true;
    return this.userRepository.save(user);
  }

  // lấy danh sách chủ đại lý
  async getDistributors(): Promise<User[]> {
    return this.userRepository.find({ where: { role: { name: 'Distributor' } } });
  }

  // lấy danh sách người dùng
  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // lấy danh sách người dùng đã duyệt
  async getVerifiedUsers(): Promise<User[]> {
    return this.userRepository.find({ where: { isVerified: true } });
  }

  // lấy danh sách người dùng chưa duyệt
  async getUnverifiedUsers(): Promise<User[]> {
    return this.userRepository.find({ where: { isVerified: false } });
  }

  // lấy danh sách người dùng đã bị chặn
  async getBlockedUsers(): Promise<User[]> {
    return this.userRepository.find({ where: { isActive: false } });
  }

  // thống kê số lượng người dùng
  async getUserCount(): Promise<number> {
    return this.userRepository.count();
  }

  async getUserStatistics(query: UserStatisticsDto) {
    const { roleId, verificationStatus, timeRangeType, startDate, endDate, year, month } = query;

    // Build base query
    let queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    // Apply role filter
    if (roleId) {
      queryBuilder = queryBuilder.where('role.id = :roleId', { roleId });
    }

    // Apply verification status filter
    if (verificationStatus !== VerificationStatus.ALL) {
      queryBuilder = queryBuilder.andWhere('user.isVerified = :isVerified', {
        isVerified: verificationStatus === VerificationStatus.VERIFIED,
      });
    }

    // Get pie chart data (by role)
    const pieChartData = await this.getPieChartData(queryBuilder);

    // Get bar chart data based on time range
    const barChartData = await this.getBarChartData(queryBuilder, {
      timeRangeType,
      startDate,
      endDate,
      year,
      month,
    });

    // Get total statistics
    const totalStats = await this.getTotalStatistics(queryBuilder);

    return {
      pieChart: pieChartData,
      barChart: barChartData,
      totalStats,
    };
  }

  private async getPieChartData(queryBuilder: any) {
    const roleStats = await queryBuilder
      .select('role.name', 'roleName')
      .addSelect('COUNT(user.id)', 'count')
      .groupBy('role.name')
      .getRawMany();

    return roleStats.map(stat => ({
      label: stat.roleName,
      value: parseInt(stat.count),
    }));
  }

  private async getBarChartData(queryBuilder: any, timeParams: any) {
    const { timeRangeType, startDate, endDate, year, month } = timeParams;
    let intervals: { start: Date; end: Date; label: string }[] = [];

    // Calculate time intervals based on timeRangeType
    if (timeRangeType === TimeRangeType.YEAR) {
      const targetYear = year || new Date().getFullYear();
      intervals = this.generateYearlyIntervals(targetYear);
    } else if (timeRangeType === TimeRangeType.MONTH) {
      const targetMonth = month || new Date().getMonth() + 1;
      const targetYear = year || new Date().getFullYear();
      intervals = this.generateMonthlyIntervals(targetYear, targetMonth);
    } else if (timeRangeType === TimeRangeType.DATE_RANGE) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      intervals = this.generateDateRangeIntervals(start, end);
    } else {
      // Default to last 12 months
      intervals = this.generateLast12MonthsIntervals();
    }

    // Get user counts for each interval
    const barChartData = await Promise.all(
      intervals.map(async (interval) => {
        const count = await queryBuilder
          .andWhere('user.createdAt >= :startDate', { startDate: interval.start })
          .andWhere('user.createdAt < :endDate', { endDate: interval.end })
          .getCount();

        return {
          label: interval.label,
          value: count,
        };
      })
    );

    return barChartData;
  }

  private async getTotalStatistics(queryBuilder: any) {
    const totalUsers = await queryBuilder.getCount();
    const activeUsers = await queryBuilder
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getCount();
    const verifiedUsers = await queryBuilder
      .andWhere('user.isVerified = :isVerified', { isVerified: true })
      .getCount();

    return {
      totalUsers,
      activeUsers,
      verifiedUsers,
    };
  }

  private generateYearlyIntervals(year: string | number) {
    const intervals: { start: Date; end: Date; label: string }[] = [];
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(Number(year), month - 1, 1);
      const endDate = new Date(Number(year), month, 0);
      intervals.push({
        start: startDate,
        end: endDate,
        label: `${month}/${year}`,
      });
    }
    return intervals;
  }

  private generateMonthlyIntervals(year: number, month: number) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const intervals: { start: Date; end: Date; label: string }[] = [];
    const intervalSize = Math.ceil(daysInMonth / 12);

    for (let i = 0; i < 12; i++) {
      const startDay = i * intervalSize + 1;
      const endDay = Math.min((i + 1) * intervalSize, daysInMonth);
      intervals.push({
        start: new Date(year, month - 1, startDay),
        end: new Date(year, month - 1, endDay + 1),
        label: `${startDay}-${endDay}/${month}/${year}`,
      });
    }
    return intervals;
  }

  private generateDateRangeIntervals(start: Date, end: Date) {
    const intervals: { start: Date; end: Date; label: string }[] = [];
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const intervalSize = Math.ceil(totalDays / 12);

    for (let i = 0; i < 12; i++) {
      const intervalStart = new Date(start);
      intervalStart.setDate(start.getDate() + (i * intervalSize));
      const intervalEnd = new Date(start);
      intervalEnd.setDate(start.getDate() + ((i + 1) * intervalSize - 1));
      if (intervalEnd > end) intervalEnd.setTime(end.getTime());

      intervals.push({
        start: intervalStart,
        end: new Date(intervalEnd.getTime() + 24 * 60 * 60 * 1000),
        label: `${intervalStart.toLocaleDateString()} - ${intervalEnd.toLocaleDateString()}`,
      });
    }
    return intervals;
  }

  private generateLast12MonthsIntervals() {
    const intervals: { start: Date; end: Date; label: string }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      intervals.push({
        start: startDate,
        end: new Date(endDate.getTime() + 24 * 60 * 60 * 1000),
        label: `${startDate.getMonth() + 1}/${startDate.getFullYear()}`,
      });
    }
    return intervals;
  }
}
