import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import {
  OrderStatus,
  OrderStatusDescription,
  OrderStatusEnum,
} from './entities/order-status.entity';

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

  //tự động tạo trạng thái đơn hàng nếu chưa có
  async createDefaultStatuses() {
    const defaultStatuses = Object.values(OrderStatusEnum).map((status) => ({
      status_name: status,
      description: OrderStatusDescription[status],
      is_active: true,
    }));

    const existingStatuses = await this.orderStatusRepository.find();
    const existingStatusNames = existingStatuses.map((s) => s.status_name);

    const newStatuses = defaultStatuses.filter(
      (status) => !existingStatusNames.includes(status.status_name),
    );

    if (newStatuses.length > 0) {
      await this.orderStatusRepository.save(newStatuses);
    }

    return {
      message: 'Tạo trạng thái đơn hàng mặc định thành công',
      data: newStatuses,
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
