import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../users/user.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { Voucher, VoucherType } from './entities/voucher.entity';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
    private userService: UserService,
  ) {}

  async create(createVoucherDto: CreateVoucherDto, userId: string) {
    const creator = await this.userService.findById(userId);
    if (!creator) {
      throw new NotFoundException('Không tìm thấy người tạo voucher');
    }

    // Kiểm tra quyền tạo voucher
    if (createVoucherDto.type === VoucherType.GLOBAL && creator.role.name !== 'admin') {
      throw new BadRequestException('Chỉ admin mới có thể tạo voucher global');
    }

    // Nếu là voucher thông thường, kiểm tra distributor
    if (createVoucherDto.type === VoucherType.NORMAL) {
      if (!createVoucherDto.distributorId) {
        throw new BadRequestException('Voucher thông thường cần có đại lý');
      }
      const distributor = await this.userService.findById(createVoucherDto.distributorId);
      if (!distributor || distributor.role.name !== 'distributor') {
        throw new BadRequestException('Đại lý không hợp lệ');
      }
    }

    // Kiểm tra thời gian
    if (createVoucherDto.startDate >= createVoucherDto.endDate) {
      throw new BadRequestException('Thời gian kết thúc phải sau thời gian bắt đầu');
    }

    // Kiểm tra mã voucher trùng lặp
    const existingVoucher = await this.voucherRepository.findOne({
      where: { code: createVoucherDto.code },
    });
    if (existingVoucher) {
      throw new BadRequestException('Mã voucher đã tồn tại');
    }

    const voucher = this.voucherRepository.create({
      ...createVoucherDto,
      createdBy: creator,
      distributor: createVoucherDto.distributorId ? await this.userService.findById(createVoucherDto.distributorId) : creator,
    });

    return this.voucherRepository.save(voucher);
  }

  async findAll() {
    return this.voucherRepository.find({
      relations: ['createdBy', 'distributor'],
    });
  }

  async findOne(id: string) {
    const voucher = await this.voucherRepository.findOne({
      where: { id },
      relations: ['createdBy', 'distributor'],
    });
    if (!voucher) {
      throw new NotFoundException('Không tìm thấy voucher');
    }
    return voucher;
  }

  async findByCode(code: string) {
    const voucher = await this.voucherRepository.findOne({
      where: { code },
      relations: ['createdBy', 'distributor'],
    });
    if (!voucher) {
      throw new NotFoundException('Không tìm thấy voucher');
    }
    return voucher;
  }

  async validateVoucher(code: string, userId: string, orderAmount: number) {
    const voucher = await this.findByCode(code);
    const user = await this.userService.findById(userId);

    // Kiểm tra voucher có tồn tại và còn hoạt động
    if (!voucher.isActive) {
      throw new BadRequestException('Voucher không còn hoạt động');
    }

    // Kiểm tra thời gian
    const now = new Date();
    if (now < voucher.startDate || now > voucher.endDate) {
      throw new BadRequestException('Voucher đã hết hạn hoặc chưa đến thời gian sử dụng');
    }

    // Kiểm tra số lượng
    if (voucher.usedCount >= voucher.quantity) {
      throw new BadRequestException('Voucher đã hết lượt sử dụng');
    }

    // Kiểm tra giá trị đơn hàng tối thiểu
    if (voucher.minOrderValue && orderAmount < voucher.minOrderValue) {
      throw new BadRequestException(`Đơn hàng phải có giá trị tối thiểu ${voucher.minOrderValue}`);
    }

    // Kiểm tra loại voucher và quyền sử dụng
    if (voucher.type === VoucherType.NORMAL) {
      if (!voucher.distributor) {
        throw new BadRequestException('Voucher không hợp lệ');
      }
      // Kiểm tra xem sản phẩm trong giỏ hàng có thuộc đại lý này không
      // TODO: Implement logic kiểm tra sản phẩm trong giỏ hàng
    }

    return voucher;
  }

  async applyVoucher(code: string, userId: string, orderAmount: number) {
    const voucher = await this.validateVoucher(code, userId, orderAmount);
    
    let discountAmount = 0;
    if (voucher.discountType === 'PERCENTAGE') {
      discountAmount = (orderAmount * voucher.discountValue) / 100;
      if (voucher.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, voucher.maxDiscountAmount);
      }
    } else {
      discountAmount = voucher.discountValue;
    }

    // Cập nhật số lần sử dụng
    voucher.usedCount += 1;
    await this.voucherRepository.save(voucher);

    return {
      voucher,
      discountAmount,
      finalAmount: orderAmount - discountAmount,
    };
  }
}
