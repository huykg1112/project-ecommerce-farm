import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { In, Repository } from 'typeorm';
import { BatchProduct } from '../batch-product/entities/batch-product.entity';
import { OrderDetail } from '../order-detail/entities/order-detail.entity';
import { OrderStatus } from '../order-status/entities/order-status.entity';
import { PaymentMethod } from '../payment-method/entities/payment-method.entity';
import { User } from '../user/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BatchProduct)
    private readonly batchProductRepository: Repository<BatchProduct>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      // Validate payment method and order status
      const paymentMethod = await this.paymentMethodRepository.findOne({
        where: { payment_method_id: createOrderDto.payment_method_id },
      });
      if (!paymentMethod) {
        throw new BadRequestException('Payment method not found');
      }

      const orderStatus = await this.orderStatusRepository.findOne({
        where: { status_name: 'PENDING' }, // Default status
      });
      if (!orderStatus) {
        throw new BadRequestException('Order status not found');
      }
      // find user by id
      const user = await this.userRepository.findOne({
        where: { user_id: createOrderDto.user_id },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      //find distributor by id
      const distributor = await this.userRepository.findOne({
        where: { user_id: createOrderDto.distributor_id },
      });
      if (!distributor) {
        throw new BadRequestException('Distributor not found');
      }
      // FindBatchProduct by id
      const batchProduct = await this.batchProductRepository.findOne({
        where: { batch_id: createOrderDto.batch_id },
      });
      if (!batchProduct) {
        throw new BadRequestException('Batch product not found');
      }
      // Generate a random order code Chữ cái Hoa
      const randomCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      const order_code = `ORDER-${Date.now()}-${randomCode}`;

      // Create order
      const order = this.orderRepository.create({
        order_code,
        user,
        distributor,
        payment_method: paymentMethod,
        status: orderStatus,
      });

      const savedOrder = await this.orderRepository.save(order);
      return {
        message: 'Order created successfully',
        data: savedOrder,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // async findAll(filter: FilterOrderDto, page: number, limit: number) {
  //   const skip = (page - 1) * limit;
  //   const where: FindOptionsWhere<Order> = {};

  //   if (filter.status_id) {
  //     where.orderStatus = { id: filter.status_id };
  //   }
  //   if (filter.paymentMethod) {
  //     where.paymentMethod = { name: filter.paymentMethod };
  //   }
  //   if (filter.fromDate && filter.toDate) {
  //     where.orderDate = Between(
  //       new Date(filter.fromDate),
  //       new Date(filter.toDate),
  //     );
  //   }

  //   const [orders, total] = await this.orderRepository.findAndCount({
  //     where,
  //     relations: [
  //       'orderStatus',
  //       'paymentMethod',
  //       'orderDetails',
  //       'orderDetails.batchProduct',
  //     ],
  //     skip,
  //     take: limit,
  //     order: { orderDate: 'DESC' },
  //   });

  //   return {
  //     data: orders,
  //     meta: {
  //       total,
  //       page,
  //       limit,
  //       totalPages: Math.ceil(total / limit),
  //     },
  //   };
  // }
  // Get all orders

  async findAll() {
    return this.orderRepository.find({
      where: { is_deleted: false },
      relations: [
        'status',
        'payment_method',
        'order_details',
        'order_details.batch_product',
        'order_details.batch_product.product',
        'order_details.batch_product.product.images',
        'order_details.batch_product.product_types',
        'order_details.batch_product.promotions',
        'order_details.batch_product.invenstory',
      ],
    });
  }

  async findOrdersByUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.orderRepository.find({
      where: { user, is_deleted: false },
      relations: [
        'status',
        'payment_method',
        'order_details',
        'order_details.batch_product',
        'order_details.batch_product.product',
        'order_details.batch_product.product.images',
        'order_details.batch_product.product_types',
        'order_details.batch_product.promotions',
        'order_details.batch_product.invenstory',
      ],
    });
  }

  async findOrdersByDistributor(distributorId: string) {
    const distributor = await this.userRepository.findOne({
      where: { user_id: distributorId },
    });
    if (!distributor) {
      throw new NotFoundException('Distributor not found');
    }

    return this.orderRepository.find({
      where: { distributor, is_deleted: false },
      relations: [
        'status',
        'payment_method',
        'order_details',
        'order_details.batch_product',
        'order_details.batch_product.product',
        'order_details.batch_product.product.images',
        'order_details.batch_product.product_types',
        'order_details.batch_product.promotions',
        'order_details.batch_product.invenstory',
      ],
    });
  }

  async findOrderByUser(id: string, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { order_id: id, user: { user_id: userId }, is_deleted: false },
      relations: [
        'status',
        'payment_method',
        'order_details',
        'order_details.batch_product',
        'order_details.batch_product.product',
        'order_details.batch_product.product.images',
        'order_details.batch_product.product_types',
        'order_details.batch_product.promotions',
        'order_details.batch_product.invenstory',
      ],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // async getOrderStatistics(
  //   distributorId?: string,
  //   fromDate?: string,
  //   toDate?: string,
  // ) {
  //   const queryBuilder = this.orderRepository
  //     .createQueryBuilder('order')
  //     .leftJoin('order.orderDetails', 'orderDetails')
  //     .leftJoin('orderDetails.batchProduct', 'batchProduct')
  //     .leftJoin('order.orderStatus', 'orderStatus');

  //   if (distributorId) {
  //     queryBuilder.where('batchProduct.distributorId = :distributorId', {
  //       distributorId,
  //     });
  //   }
  //   if (fromDate && toDate) {
  //     queryBuilder.andWhere('order.orderDate BETWEEN :fromDate AND :toDate', {
  //       fromDate,
  //       toDate,
  //     });
  //   }

  //   const totalOrders = await queryBuilder.getCount();

  //   const totalRevenue = await queryBuilder
  //     .select('SUM(order.totalAmount)', 'total')
  //     .getRawOne();

  //   const ordersByStatus = await this.orderRepository
  //     .createQueryBuilder('order')
  //     .leftJoin('order.orderStatus', 'orderStatus')
  //     .leftJoin('order.orderDetails', 'orderDetails')
  //     .leftJoin('orderDetails.batchProduct', 'batchProduct')
  //     .select('orderStatus.name', 'status')
  //     .addSelect('COUNT(order.id)', 'count')
  //     .where(
  //       distributorId ? 'batchProduct.distributorId = :distributorId' : '1=1',
  //       { distributorId },
  //     )
  //     .andWhere(
  //       fromDate && toDate
  //         ? 'order.orderDate BETWEEN :fromDate AND :toDate'
  //         : '1=1',
  //       {
  //         fromDate,
  //         toDate,
  //       },
  //     )
  //     .groupBy('orderStatus.name')
  //     .getRawMany();

  //   return {
  //     totalOrders,
  //     totalRevenue: totalRevenue.total || 0,
  //     ordersByStatus,
  //   };
  // }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { order_id: id },
      relations: [
        'status',
        'payment_method',
        'order_details',
        'order_details.batch_product',
        'order_details.batch_product.product',
        'order_details.batch_product.product.images',
        'order_details.batch_product.product_types',
        'order_details.batch_product.promotions',
        'order_details.batch_product.invenstory',
      ],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    if (updateOrderDto.payment_method_id) {
      const paymentMethod = await this.paymentMethodRepository.findOne({
        where: { payment_method_id: updateOrderDto.payment_method_id },
      });
      if (!paymentMethod) {
        throw new BadRequestException('Payment method not found');
      }
      order.payment_method = paymentMethod;
    }

    if (updateOrderDto.status_id) {
      const orderStatus = await this.orderStatusRepository.findOne({
        where: { status_id: updateOrderDto.status_id },
      });
      if (!orderStatus) {
        throw new BadRequestException('Order status not found');
      }
      order.status = orderStatus;
    }

    Object.assign(order, updateOrderDto);
    await this.orderRepository.save(order);

    return this.findOne(id);
  }

  async updateOrderStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.findOne(id);

    const orderStatus = await this.orderStatusRepository.findOne({
      where: { status_id: updateOrderStatusDto.status_id },
    });
    if (!orderStatus) {
      throw new BadRequestException('Order status not found');
    }

    order.status = orderStatus;
    await this.orderRepository.save(order);

    return this.findOne(id);
  }

  async cancelOrder(id: string, notes?: string) {
    const order = await this.findOne(id);

    const cancelledStatus = await this.orderStatusRepository.findOne({
      where: { status_name: 'CANCELLED' },
    });
    if (!cancelledStatus) {
      throw new BadRequestException('Cancelled status not found');
    }

    order.status = cancelledStatus;
    if (notes) {
      order.notes = notes;
    }
    await this.orderRepository.save(order);

    return {
      message: 'Order cancelled successfully',
      order: await this.findOne(id),
    };
  }

  async confirmOrder(id: string, notes?: string) {
    const order = await this.findOne(id);

    // Check if order can be confirmed
    if (order.status.status_name !== 'PENDING') {
      throw new BadRequestException('Only pending orders can be confirmed');
    }

    const confirmedStatus = await this.orderStatusRepository.findOne({
      where: { status_name: 'CONFIRMED' },
    });
    if (!confirmedStatus) {
      throw new BadRequestException('Confirmed status not found');
    }

    order.status = confirmedStatus;
    if (notes) {
      order.notes = notes;
    }
    await this.orderRepository.save(order);

    return {
      message: 'Order confirmed successfully',
      order: await this.findOne(id),
    };
  }

  // Batch operations
  async batchUpdateStatus(
    orderIds: string[],
    statusId: string,
    notes?: string,
  ) {
    const orders = await this.orderRepository.find({
      where: { order_id: In(orderIds) },
      relations: [
        'status',
        'user',
        'distributor',
        'payment_method',
        'order_details',
      ],
    });
    if (orders.length !== orderIds.length) {
      throw new BadRequestException('Some orders not found');
    }

    const status = await this.orderStatusRepository.findOne({
      where: { status_id: statusId },
    });
    if (!status) {
      throw new BadRequestException('Status not found');
    }

    const updatePromises = orders.map(async (order) => {
      order.status = status;
      if (notes) {
        order.notes = notes;
      }
      return this.orderRepository.save(order);
    });

    await Promise.all(updatePromises);

    return {
      message: `Updated ${orders.length} orders successfully`,
      success_count: orders.length,
      failed_count: 0,
    };
  }

  async batchConfirmOrders(orderIds: string[], notes?: string) {
    const orders = await this.orderRepository.find({
      where: { order_id: In(orderIds) },
      relations: [
        'status',
        'user',
        'distributor',
        'payment_method',
        'order_details',
      ],
    });
    if (orders.length !== orderIds.length) {
      throw new BadRequestException('Some orders not found');
    }

    const confirmedStatus = await this.orderStatusRepository.findOne({
      where: { status_name: 'CONFIRMED' },
    });
    if (!confirmedStatus) {
      throw new BadRequestException('Confirmed status not found');
    }

    let successCount = 0;
    let failedCount = 0;
    const failedOrders: string[] = [];

    const updatePromises = orders.map(async (order) => {
      try {
        if (order.status.status_name !== 'PENDING') {
          failedCount++;
          failedOrders.push(order.order_id);
          return;
        }

        order.status = confirmedStatus;
        if (notes) {
          order.notes = notes;
        }
        await this.orderRepository.save(order);
        successCount++;
      } catch (error) {
        failedCount++;
        failedOrders.push(order.order_id);
      }
    });

    await Promise.all(updatePromises);

    return {
      message: `Confirmed ${successCount} orders successfully`,
      success_count: successCount,
      failed_count: failedCount,
      failed_orders: failedOrders,
    };
  }

  async batchCancelOrders(orderIds: string[], notes?: string) {
    const orders = await this.orderRepository.find({
      where: { order_id: In(orderIds) },
      relations: [
        'status',
        'user',
        'distributor',
        'payment_method',
        'order_details',
      ],
    });
    if (orders.length !== orderIds.length) {
      throw new BadRequestException('Some orders not found');
    }

    const cancelledStatus = await this.orderStatusRepository.findOne({
      where: { status_name: 'CANCELLED' },
    });
    if (!cancelledStatus) {
      throw new BadRequestException('Cancelled status not found');
    }

    let successCount = 0;
    let failedCount = 0;
    const failedOrders: string[] = [];

    const updatePromises = orders.map(async (order) => {
      try {
        if (!['PENDING', 'CONFIRMED'].includes(order.status.status_name)) {
          failedCount++;
          failedOrders.push(order.order_id);
          return;
        }

        order.status = cancelledStatus;
        if (notes) {
          order.notes = notes;
        }
        await this.orderRepository.save(order);
        successCount++;
      } catch (error) {
        failedCount++;
        failedOrders.push(order.order_id);
      }
    });

    await Promise.all(updatePromises);

    return {
      message: `Cancelled ${successCount} orders successfully`,
      success_count: successCount,
      failed_count: failedCount,
      failed_orders: failedOrders,
    };
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
    return { message: 'Order deleted successfully' };
  }
}
