import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './entities/order-status.entity';

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,
  ) {}

  async findAll() {
    const statuses = await this.orderStatusRepository.find({
      order: { created_at: 'ASC' },
    });
    return {
      message: 'Lấy danh sách trạng thái đơn hàng thành công',
      data: statuses,
      total: statuses.length,
    };
  }

  async findOne(id: string) {
    const status = await this.orderStatusRepository.findOne({
      where: { status_id: id },
    });
    if (!status) {
      throw new NotFoundException(`Không tìm thấy trạng thái với id: ${id}`);
    }
    return {
      message: 'Lấy thông tin trạng thái đơn hàng thành công',
      data: status,
    };
  }

  async update(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const status = await this.orderStatusRepository.findOne({
      where: { status_id: id },
    });
    if (!status) {
      throw new NotFoundException(`Không tìm thấy trạng thái với id: ${id}`);
    }
    Object.assign(status, updateOrderStatusDto);
    const updated = await this.orderStatusRepository.save(status);
    return {
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: updated,
    };
  }
}
