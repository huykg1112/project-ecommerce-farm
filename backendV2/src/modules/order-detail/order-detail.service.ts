import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BatchProductService } from '../batch-product/batch-product.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { FilterOrderDetailDto } from './dto/filter-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { OrderDetail } from './entities/order-detail.entity';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly batchProductService: BatchProductService,
  ) {}

  async create(createOrderDetailDto: CreateOrderDetailDto) {
    // Validate batch quantity
    await this.validateBatchQuantity(
      createOrderDetailDto.batch_id,
      createOrderDetailDto.quantity,
    );

    const subtotal = this.calculateSubtotal(
      createOrderDetailDto.quantity,
      createOrderDetailDto.unit_price,
    );

    const orderDetail = this.orderDetailRepository.create({
      ...createOrderDetailDto,
      subtotal,
    });

    const saved = await this.orderDetailRepository.save(orderDetail);

    return {
      message: 'Tạo chi tiết đơn hàng thành công',
      data: saved,
    };
  }

  async findAll(filter: FilterOrderDetailDto = {}) {
    const qb = this.orderDetailRepository
      .createQueryBuilder('orderDetail')
      .leftJoinAndSelect('orderDetail.order', 'order')
      .leftJoinAndSelect('orderDetail.batch_product', 'batchProduct')
      .leftJoinAndSelect('batchProduct.product', 'product')
      .where('orderDetail.is_deleted = :is_deleted', { is_deleted: false });

    // Apply filters
    if (filter.order_id) {
      qb.andWhere('orderDetail.order = :order_id', {
        order_id: filter.order_id,
      });
    }

    if (filter.batch_id) {
      qb.andWhere('orderDetail.batch_product = :batch_id', {
        batch_id: filter.batch_id,
      });
    }

    if (filter.is_deleted !== undefined) {
      qb.andWhere('orderDetail.is_deleted = :is_deleted', {
        is_deleted: filter.is_deleted,
      });
    }

    if (filter.min_quantity) {
      qb.andWhere('orderDetail.quantity >= :min_quantity', {
        min_quantity: filter.min_quantity,
      });
    }

    if (filter.max_quantity) {
      qb.andWhere('orderDetail.quantity <= :max_quantity', {
        max_quantity: filter.max_quantity,
      });
    }

    if (filter.min_unit_price) {
      qb.andWhere('orderDetail.unit_price >= :min_unit_price', {
        min_unit_price: filter.min_unit_price,
      });
    }

    if (filter.max_unit_price) {
      qb.andWhere('orderDetail.unit_price <= :max_unit_price', {
        max_unit_price: filter.max_unit_price,
      });
    }

    if (filter.from_date) {
      qb.andWhere('orderDetail.created_at >= :from_date', {
        from_date: filter.from_date,
      });
    }

    if (filter.to_date) {
      qb.andWhere('orderDetail.created_at <= :to_date', {
        to_date: filter.to_date,
      });
    }

    qb.orderBy('orderDetail.created_at', 'DESC');

    const orderDetails = await qb.getMany();

    return {
      message: 'Lấy danh sách chi tiết đơn hàng thành công',
      data: orderDetails,
      total: orderDetails.length,
    };
  }

  async findOne(id: string) {
    const orderDetail = await this.orderDetailRepository.findOne({
      where: { order_detail_id: id, is_deleted: false },
      relations: ['order', 'batch_product', 'batch_product.product'],
    });

    if (!orderDetail) {
      throw new NotFoundException(
        `Không tìm thấy chi tiết đơn hàng với id: ${id}`,
      );
    }

    return {
      message: 'Lấy thông tin chi tiết đơn hàng thành công',
      data: orderDetail,
    };
  }

  async update(id: string, updateOrderDetailDto: UpdateOrderDetailDto) {
    const orderDetail = await this.orderDetailRepository.findOne({
      where: { order_detail_id: id, is_deleted: false },
    });

    if (!orderDetail) {
      throw new NotFoundException(
        `Không tìm thấy chi tiết đơn hàng với id: ${id}`,
      );
    }

    // Validate batch quantity if quantity is updated
    if (
      updateOrderDetailDto.quantity &&
      updateOrderDetailDto.quantity !== orderDetail.quantity
    ) {
      await this.validateBatchQuantity(
        orderDetail.batch_product.batch_id,
        updateOrderDetailDto.quantity,
      );
    }

    // Recalculate subtotal if quantity or unit_price changes
    if (updateOrderDetailDto.quantity || updateOrderDetailDto.unit_price) {
      const quantity = updateOrderDetailDto.quantity || orderDetail.quantity;
      const unitPrice =
        updateOrderDetailDto.unit_price || orderDetail.unit_price;
      updateOrderDetailDto.subtotal = this.calculateSubtotal(
        quantity,
        unitPrice,
      );
    }

    Object.assign(orderDetail, updateOrderDetailDto);
    const updated = await this.orderDetailRepository.save(orderDetail);

    return {
      message: 'Cập nhật chi tiết đơn hàng thành công',
      data: updated,
    };
  }

  async remove(id: string) {
    const orderDetail = await this.orderDetailRepository.findOne({
      where: { order_detail_id: id, is_deleted: false },
    });

    if (!orderDetail) {
      throw new NotFoundException(
        `Không tìm thấy chi tiết đơn hàng với id: ${id}`,
      );
    }

    orderDetail.is_deleted = true;
    await this.orderDetailRepository.save(orderDetail);

    return {
      message: 'Xóa chi tiết đơn hàng thành công',
      data: { order_detail_id: id },
    };
  }

  async findByOrderId(orderId: string) {
    const orderDetails = await this.orderDetailRepository.find({
      where: { order: { order_id: orderId }, is_deleted: false },
      relations: ['batch_product', 'batch_product.product'],
      order: { created_at: 'ASC' },
    });

    return {
      message: 'Lấy chi tiết đơn hàng theo order_id thành công',
      data: orderDetails,
      total: orderDetails.length,
    };
  }

  calculateSubtotal(quantity: number, unitPrice: number): number {
    if (quantity <= 0 || unitPrice < 0) {
      throw new BadRequestException(
        'Số lượng phải lớn hơn 0 và giá phải không âm',
      );
    }
    return Math.round(quantity * unitPrice * 100) / 100; // Round to 2 decimal places
  }

  async validateBatchQuantity(
    batchId: string,
    requestedQuantity: number,
  ): Promise<void> {
    const batch = await this.batchProductService.findOne(batchId);

    if (!batch) {
      throw new NotFoundException(`Không tìm thấy lô hàng với id: ${batchId}`);
    }

    if (!batch.is_active) {
      throw new BadRequestException('Lô hàng này đã bị vô hiệu hóa');
    }

    if (batch.quantity < requestedQuantity) {
      throw new BadRequestException(
        `Không đủ số lượng trong kho. Có sẵn: ${batch.quantity}, Yêu cầu: ${requestedQuantity}`,
      );
    }

    // Check if batch is expired
    const now = new Date();
    if (batch.expiry_date && new Date(batch.expiry_date) < now) {
      throw new BadRequestException('Lô hàng đã hết hạn sử dụng');
    }
  }

  async bulkCreate(
    orderDetails: CreateOrderDetailDto[],
  ): Promise<OrderDetail[]> {
    const createdDetails: OrderDetail[] = [];

    for (const detailDto of orderDetails) {
      // Validate each batch
      await this.validateBatchQuantity(detailDto.batch_id, detailDto.quantity);

      // Calculate subtotal
      const subtotal = this.calculateSubtotal(
        detailDto.quantity,
        detailDto.unit_price,
      );

      const orderDetail = this.orderDetailRepository.create({
        ...detailDto,
        subtotal,
      });

      createdDetails.push(orderDetail);
    }

    return this.orderDetailRepository.save(createdDetails);
  }

  async getTotalAmountByOrderId(orderId: string): Promise<number> {
    const result = await this.orderDetailRepository
      .createQueryBuilder('orderDetail')
      .select('SUM(orderDetail.subtotal)', 'total')
      .where('orderDetail.order = :orderId', { orderId })
      .andWhere('orderDetail.is_deleted = :is_deleted', { is_deleted: false })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }
}
