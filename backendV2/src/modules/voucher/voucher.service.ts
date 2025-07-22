import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { MoreThan, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from './entities/voucher.entity';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createVoucherDto: CreateVoucherDto,
    distributorId: string,
  ): Promise<Voucher> {
    // Validate distributor exists and has proper role
    const distributor = await this.userRepository.findOne({
      where: { user_id: distributorId },
      relations: ['role'],
    });

    if (!distributor) {
      throw new NotFoundException('Distributor not found');
    }

    if (!['Admin', 'Distributor'].includes(distributor.role.role_name)) {
      throw new BadRequestException(
        'Only Admin or Distributor can create vouchers',
      );
    }

    // Validate promotion exists

    // Check if voucher code is unique
    const existingVoucher = await this.voucherRepository.findOne({
      where: { voucher_code: createVoucherDto.voucher_code, is_deleted: false },
    });

    if (existingVoucher) {
      throw new BadRequestException('Voucher code already exists');
    }

    // Create voucher
    const voucher = this.voucherRepository.create({
      ...createVoucherDto,
      distributor,
      is_active:
        createVoucherDto.is_active !== undefined
          ? createVoucherDto.is_active
          : true,
    });

    return this.voucherRepository.save(voucher);
  }

  async findAll(distributorId?: string): Promise<Voucher[]> {
    const query = this.voucherRepository
      .createQueryBuilder('voucher')
      .leftJoinAndSelect('voucher.distributor', 'distributor')
      .where('voucher.is_deleted = :isDeleted', { isDeleted: false });

    if (distributorId) {
      query.andWhere('voucher.distributor.user_id = :distributorId', {
        distributorId,
      });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Voucher> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid voucher ID format');
    }

    const voucher = await this.voucherRepository.findOne({
      where: { voucher_id: id, is_deleted: false },
      relations: ['distributor', 'users'],
    });

    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`);
    }

    return voucher;
  }

  async findVouchersForUsers(): Promise<Voucher[]> {
    return this.voucherRepository.find({
      where: { is_active: true, is_deleted: false },
      relations: ['distributor', 'distributor.invenstory', 'users'],
    });
  }

  async findMyCollectedVouchers(
    userId: string,
    distributorId?: string,
  ): Promise<Voucher[]> {
    // lấy toàn bộ voucher có trạng thái is_active = true và is_deleted = false và end_date > now
    let vouchers = await this.voucherRepository.find({
      where: {
        is_active: true,
        is_deleted: false,
        end_date: MoreThan(new Date()),
      },
      relations: ['distributor', 'users'],
    });
    // Lấy voucher đã được người dùng thu thập
    vouchers = vouchers.filter((voucher) =>
      voucher.users.some((user) => user.user_id === userId),
    );
    if (distributorId) {
      vouchers = vouchers.filter(
        (v) => v.distributor.user_id === distributorId,
      );
    }
    return vouchers;
  }

  async update(
    id: string,
    updateVoucherDto: UpdateVoucherDto,
    distributorId: string,
  ): Promise<Voucher> {
    const voucher = await this.findOne(id);

    // Check if user has permission to update this voucher
    if (voucher.distributor.user_id !== distributorId) {
      // Check if user is admin
      const user = await this.userRepository.findOne({
        where: { user_id: distributorId },
        relations: ['role'],
      });

      if (!user || user.role.role_name !== 'Admin') {
        throw new BadRequestException('You can only update your own vouchers');
      }
    }

    // Check voucher code uniqueness if provided
    if (
      updateVoucherDto.voucher_code &&
      updateVoucherDto.voucher_code !== voucher.voucher_code
    ) {
      const existingVoucher = await this.voucherRepository.findOne({
        where: { voucher_code: updateVoucherDto.voucher_code },
      });

      if (existingVoucher) {
        throw new BadRequestException('Voucher code already exists');
      }
    }

    Object.assign(voucher, updateVoucherDto);
    voucher.updated_at = new Date();

    return this.voucherRepository.save(voucher);
  }

  async remove(id: string, distributorId: string): Promise<void> {
    const voucher = await this.findOne(id);

    // Check if user has permission to delete this voucher
    if (voucher.distributor.user_id !== distributorId) {
      // Check if user is admin
      const user = await this.userRepository.findOne({
        where: { user_id: distributorId },
        relations: ['role'],
      });

      if (!user || user.role.role_name !== 'Admin') {
        throw new BadRequestException('You can only delete your own vouchers');
      }
    }

    // Soft delete
    voucher.is_deleted = true;
    voucher.updated_at = new Date();
    await this.voucherRepository.save(voucher);
  }

  async toggleActive(id: string, distributorId: string): Promise<Voucher> {
    const voucher = await this.findOne(id);

    // Check if user has permission to toggle this voucher
    if (voucher.distributor.user_id !== distributorId) {
      // Check if user is admin
      const user = await this.userRepository.findOne({
        where: { user_id: distributorId },
        relations: ['role'],
      });

      if (!user || user.role.role_name !== 'Admin') {
        throw new BadRequestException('You can only toggle your own vouchers');
      }
    }

    voucher.is_active = !voucher.is_active;
    voucher.updated_at = new Date();

    return this.voucherRepository.save(voucher);
  }

  async findByCode(code: string): Promise<Voucher | null> {
    return this.voucherRepository.findOne({
      where: { voucher_code: code, is_deleted: false },
      relations: ['distributor'],
    });
  }

  async collectVoucher(voucherId: string, userId: string): Promise<Voucher> {
    const voucher = await this.findOne(voucherId);

    // Check if voucher is active
    if (!voucher.is_active) {
      throw new BadRequestException('Voucher is not active');
    }

    // Check if usage limit is exceeded
    if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
      throw new BadRequestException('Voucher usage limit exceeded');
    }

    // Check if voucher is within valid date range
    const now = new Date();
    if (voucher.start_date && now < voucher.start_date) {
      throw new BadRequestException('Voucher is not yet valid');
    }

    if (voucher.end_date && now > voucher.end_date) {
      throw new BadRequestException('Voucher has expired');
    }

    // Get user
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['vouchers'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has this voucher
    const hasVoucher = user.vouchers.some((v) => v.voucher_id === voucherId);
    if (hasVoucher) {
      throw new BadRequestException('Voucher đã được thu thập');
    }

    // Increment used count
    voucher.used_count += 1;
    voucher.updated_at = new Date();
    voucher.users.push(user);
    await this.voucherRepository.save(voucher);

    return voucher;
  }

  async batchToggleStatus(ids: string[], distributorId: string): Promise<void> {
    const vouchers = await this.voucherRepository
      .createQueryBuilder('voucher')
      .leftJoinAndSelect('voucher.distributor', 'distributor')
      .where('voucher.voucher_id IN (:...ids)', { ids })
      .andWhere('voucher.is_deleted = :isDeleted', { isDeleted: false })
      .getMany();

    // Check if user is admin
    const user = await this.userRepository.findOne({
      where: { user_id: distributorId },
      relations: ['role'],
    });

    const isAdmin = user && user.role.role_name === 'Admin';

    // Filter vouchers user can modify
    const allowedVouchers = vouchers.filter(
      (voucher) => isAdmin || voucher.distributor.user_id === distributorId,
    );

    // Toggle status for allowed vouchers
    for (const voucher of allowedVouchers) {
      voucher.is_active = !voucher.is_active;
      voucher.updated_at = new Date();
    }

    await this.voucherRepository.save(allowedVouchers);
  }

  async batchDelete(ids: string[], distributorId: string): Promise<void> {
    const vouchers = await this.voucherRepository
      .createQueryBuilder('voucher')
      .leftJoinAndSelect('voucher.distributor', 'distributor')
      .where('voucher.voucher_id IN (:...ids)', { ids })
      .andWhere('voucher.is_deleted = :isDeleted', { isDeleted: false })
      .getMany();

    // Check if user is admin
    const user = await this.userRepository.findOne({
      where: { user_id: distributorId },
      relations: ['role'],
    });

    const isAdmin = user && user.role.role_name === 'Admin';

    // Filter vouchers user can delete
    const allowedVouchers = vouchers.filter(
      (voucher) => isAdmin || voucher.distributor.user_id === distributorId,
    );

    // Soft delete allowed vouchers
    for (const voucher of allowedVouchers) {
      voucher.is_deleted = true;
      voucher.updated_at = new Date();
    }

    await this.voucherRepository.save(allowedVouchers);
  }
}
