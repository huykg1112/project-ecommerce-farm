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
import { Product } from '../product/entities/product.entity';
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
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user_id: string) {
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
        where: { user_id: user_id },
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

      // Validate batch products and check inventory
      for (const detail of createOrderDto.order_details) {
        const batchProduct = await this.batchProductRepository.findOne({
          where: { batch_id: detail.batch_id },
          relations: ['product'],
        });

        if (!batchProduct) {
          throw new BadRequestException(
            `Batch product with ID ${detail.batch_id} not found`,
          );
        }

        if (batchProduct.quantity < detail.quantity) {
          throw new BadRequestException(
            `Insufficient inventory for batch ${detail.batch_id}. Available: ${batchProduct.quantity}, Requested: ${detail.quantity}`,
          );
        }
      }

      // Generate a random order code - max 20 characters
      const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
      const randomCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase(); // 6 characters
      const order_code = `ORD-${timestamp}-${randomCode}`; // Total: 4 + 8 + 1 + 6 = 19 characters

      // Create order first
      const order = this.orderRepository.create({
        order_code,
        user,
        distributor,
        payment_method: paymentMethod,
        status: orderStatus,
        shipping_address: createOrderDto.shipping_address,
        total_amount: createOrderDto.total_amount,
        notes: createOrderDto.notes,
        estimated_delivery_date: createOrderDto.estimated_delivery_date,
      });

      const savedOrder = await this.orderRepository.save(order);

      // Create order details and update inventory
      const orderDetails: OrderDetail[] = [];

      for (const detail of createOrderDto.order_details) {
        // Get batch product with current data
        const batchProduct = await this.batchProductRepository.findOne({
          where: { batch_id: detail.batch_id },
          relations: ['product'],
        });

        if (!batchProduct) {
          throw new BadRequestException(
            `Batch product with ID ${detail.batch_id} not found`,
          );
        }

        // Create order detail
        const orderDetail = this.orderDetailRepository.create({
          order: savedOrder,
          batch_product: batchProduct,
          quantity: detail.quantity,
          unit_price: batchProduct.unit_product_price,
          subtotal: detail.quantity * batchProduct.unit_product_price,
          notes: detail.notes,
        });

        orderDetails.push(orderDetail);

        // Update batch product quantity (inventory)
        await this.batchProductRepository.update(
          { batch_id: detail.batch_id },
          { quantity: batchProduct.quantity - detail.quantity },
        );

        // Update product total_saled
        if (batchProduct.product && batchProduct.product.product_id) {
          // tìm prodtuct theo product_id
          const product = await this.productRepository.findOne({
            where: { product_id: batchProduct.product.product_id },
          });

          if (product) {
            await this.productRepository.update(
              { product_id: product.product_id },
              {
                total_saled: product.total_saled + detail.quantity,
              },
            );
          }
        }
      }

      // Save all order details
      const savedOrderDetails =
        await this.orderDetailRepository.save(orderDetails);

      // Update order with order details
      savedOrder.order_details = savedOrderDetails;
      await this.orderRepository.save(savedOrder);

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
        'user',
        'distributor',
        'distributor.invenstory',
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
      where: { user: { user_id: userId }, is_deleted: false },
      relations: [
        'status',
        'payment_method',
        'user',
        'distributor',
        'distributor.invenstory',
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
      relations: [
        'status',
        'user',
        'distributor',
        'distributor.invenstory',
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
    if (!distributor) {
      throw new NotFoundException('Distributor not found');
    }

    return this.orderRepository.find({
      where: { distributor, is_deleted: false },
      relations: [
        'status',
        'user',
        'distributor',
        'distributor.invenstory',
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
        'user',
        'distributor',
        'distributor.invenstory',
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
        'user',
        'distributor',
        'distributor.invenstory',
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

    // Check if order can be cancelled
    if (!['PENDING', 'CONFIRMED'].includes(order.status.status_name)) {
      throw new BadRequestException(
        'Only pending or confirmed orders can be cancelled',
      );
    }

    const cancelledStatus = await this.orderStatusRepository.findOne({
      where: { status_name: 'CANCELLED' },
    });
    if (!cancelledStatus) {
      throw new BadRequestException('Cancelled status not found');
    }

    // Restore inventory and update product total_saled for each order detail
    for (const orderDetail of order.order_details) {
      // Restore batch product quantity (inventory)
      await this.batchProductRepository.update(
        { batch_id: orderDetail.batch_product.batch_id },
        { quantity: () => `quantity + ${orderDetail.quantity}` },
      );

      // Reduce product total_saled
      if (orderDetail.batch_product.product) {
        await this.productRepository.update(
          { product_id: orderDetail.batch_product.product.product_id },
          {
            total_saled: () =>
              `GREATEST(total_saled - ${orderDetail.quantity}, 0)`,
          },
        );
      }
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
