import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';

export enum PaymentMethodEnum {
  COD = 'COD', // Nhận khi giao hàng
  VNPAY = 'VNPAY', // Thanh toán trực tuyến qua VNPay
}

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async create(createPaymentMethodDto: CreatePaymentMethodDto) {
    // Chỉ cho phép 2 phương thức
    if (
      ![PaymentMethodEnum.COD, PaymentMethodEnum.VNPAY].includes(
        createPaymentMethodDto.method_name as any,
      )
    ) {
      throw new BadRequestException('Chỉ cho phép phương thức COD hoặc VNPAY');
    }
    // Kiểm tra trùng tên
    const existed = await this.paymentMethodRepository.findOne({
      where: { method_name: createPaymentMethodDto.method_name },
    });
    if (existed) {
      throw new BadRequestException('Phương thức này đã tồn tại');
    }
    const method = this.paymentMethodRepository.create(createPaymentMethodDto);
    const saved = await this.paymentMethodRepository.save(method);
    return {
      message: 'Tạo phương thức thanh toán thành công',
      data: saved,
    };
  }

  async findAll() {
    const methods = await this.paymentMethodRepository.find({
      order: { created_at: 'ASC' },
    });
    return {
      message: 'Lấy danh sách phương thức thanh toán thành công',
      data: methods,
      total: methods.length,
    };
  }

  async findOne(id: string) {
    const method = await this.paymentMethodRepository.findOne({
      where: { payment_method_id: id },
    });
    if (!method) {
      throw new NotFoundException(`Không tìm thấy phương thức với id: ${id}`);
    }
    return {
      message: 'Lấy thông tin phương thức thanh toán thành công',
      data: method,
    };
  }

  async update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    if (
      updatePaymentMethodDto.method_name &&
      ![PaymentMethodEnum.COD, PaymentMethodEnum.VNPAY].includes(
        updatePaymentMethodDto.method_name as any,
      )
    ) {
      throw new BadRequestException('Chỉ cho phép phương thức COD hoặc VNPAY');
    }
    const method = await this.paymentMethodRepository.findOne({
      where: { payment_method_id: id },
    });
    if (!method) {
      throw new NotFoundException(`Không tìm thấy phương thức với id: ${id}`);
    }
    Object.assign(method, updatePaymentMethodDto);
    const updated = await this.paymentMethodRepository.save(method);
    return {
      message: 'Cập nhật phương thức thanh toán thành công',
      data: updated,
    };
  }

  async remove(id: string) {
    const method = await this.paymentMethodRepository.findOne({
      where: { payment_method_id: id },
    });
    if (!method) {
      throw new NotFoundException(`Không tìm thấy phương thức với id: ${id}`);
    }
    await this.paymentMethodRepository.remove(method);
    return {
      message: 'Xóa phương thức thanh toán thành công',
      data: { payment_method_id: id },
    };
  }

  // TODO: Tích hợp API VNPay
  // 1. Đăng ký tài khoản merchant với VNPay để lấy các thông tin cấu hình (tmnCode, secretKey, v.v.)
  // 2. Cài đặt thư viện VNPay (npm i vnpay)
  // 3. Tạo endpoint khởi tạo thanh toán, sinh URL thanh toán VNPay với các tham số đơn hàng
  // 4. Redirect user sang trang thanh toán của VNPay
  // 5. Tạo endpoint callback để nhận kết quả thanh toán từ VNPay (success/fail)
  // 6. Xác thực checksum từ VNPay trả về để đảm bảo tính toàn vẹn
  // 7. Cập nhật trạng thái đơn hàng dựa trên kết quả thanh toán
  // 8. Xử lý các trường hợp lỗi, hoàn tiền nếu cần
}
