import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@root/src/auth/enums/role.enum';
import { In, LessThanOrEqual, Repository } from 'typeorm';
import { ProductType } from '../product-type/entities/product-type.entity';
import { Product } from '../product/entities/product.entity';
import { Promotion } from '../promotion/entities/promotion.entity';
import { CreateBatchProductDto } from './dto/create-batch-product.dto';
import { UpdateBatchProductDto } from './dto/update-batch-product.dto';
import { BatchProduct } from './entities/batch-product.entity';

@Injectable()
export class BatchProductService {
  constructor(
    @InjectRepository(BatchProduct)
    private readonly batchRepo: Repository<BatchProduct>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductType)
    private readonly productTypeRepo: Repository<ProductType>,

    @InjectRepository(Promotion)
    private readonly promotionRepo: Repository<Promotion>,
  ) {}

  async create(invenstory_id: string, dto: CreateBatchProductDto) {
    //tạo liên kết với loại sản phẩm
    let batch = this.batchRepo.create({
      invenstory: { invenstory_id },
      unit_product_price: dto.unit_product_price,
      batch_number: dto.batch_number,
      quantity: dto.quantity,
      manufactured_date: dto.manufactured_date
        ? new Date(dto.manufactured_date)
        : undefined,
      expiry_date: new Date(dto.expiry_date),
      low_stock_threshold: dto.low_stock_threshold,
    });

    if (dto.product_type_id) {
      const productType = await this.productTypeRepo.findOne({
        where: { product_type_id: dto.product_type_id },
      });
      if (!productType) throw new NotFoundException('Product type not found');
      batch.product_types = productType;
    }
    if (dto.product_id) {
      const product = await this.productRepo.findOne({
        where: { product_id: dto.product_id },
      });
      if (!product) throw new NotFoundException('Product not found');
      batch.product = product;
    }

    if (dto.promotion_ids && dto.promotion_ids.length > 0) {
      const promotions = await this.promotionRepo.findBy({
        promotion_id: In(dto.promotion_ids),
      });
      if (promotions.length !== dto.promotion_ids.length) {
        throw new NotFoundException('Some promotions not found');
      }
      batch.promotions = promotions;
    }

    return this.batchRepo.save(batch);
  }
  async findAll(
    role_name: string,
    invenstory_id: string,
  ): Promise<BatchProduct[]> {
    if (role_name === Role.ADMIN) {
      return this.batchRepo.find({
        where: { is_deleted: false },
        relations: [
          'product',
          'product.images',
          'invenstory',
          'product_types',
          'promotions',
        ],
      });
    }
    return this.batchRepo.find({
      where: {
        is_deleted: false,
        invenstory: { invenstory_id: invenstory_id },
      },
      relations: [
        'product',
        'product.images',
        'invenstory',
        'product_types',
        'promotions',
      ],
    });
  }

  // async findAll(filter: FilterBatchProductDto = {}) {
  //   const qb = this.batchRepo
  //     .createQueryBuilder('batch')
  //     .leftJoinAndSelect('batch.product', 'product')
  //     .leftJoinAndSelect('batch.invenstory', 'invenstory');
  //   if (filter.product_id)
  //     qb.andWhere('batch.product = :product_id', {
  //       product_id: filter.product_id,
  //     });
  //   if (filter.invenstory_id)
  //     qb.andWhere('batch.invenstory = :invenstory_id', {
  //       invenstory_id: filter.invenstory_id,
  //     });
  //   if (filter.is_active !== undefined)
  //     qb.andWhere('batch.is_active = :is_active', {
  //       is_active: filter.is_active,
  //     });
  //   if (filter.batch_number)
  //     qb.andWhere('batch.batch_number LIKE :batch_number', {
  //       batch_number: `%${filter.batch_number}%`,
  //     });
  //   if (filter.from_date)
  //     qb.andWhere('batch.expiry_date >= :from_date', {
  //       from_date: filter.from_date,
  //     });
  //   if (filter.to_date)
  //     qb.andWhere('batch.expiry_date <= :to_date', { to_date: filter.to_date });
  //   if (filter.expiring_soon_days) {
  //     const now = new Date();
  //     const soon = new Date();
  //     soon.setDate(now.getDate() + filter.expiring_soon_days);
  //     qb.andWhere('batch.expiry_date BETWEEN :now AND :soon', { now, soon });
  //   }
  //   if (filter.low_stock) {
  //     qb.andWhere('batch.quantity <= batch.low_stock_threshold');
  //   }
  //   return qb.getMany();
  // }

  async findOne(id: string) {
    const batch = await this.batchRepo.findOne({
      where: { batch_id: id, is_deleted: false },
      relations: ['product', 'invenstory'],
    });
    if (!batch) throw new NotFoundException('Batch not found');
    return batch;
  }

  async update(id: string, dto: UpdateBatchProductDto) {
    const batch = await this.batchRepo.findOne({
      where: { batch_id: id, is_deleted: false },
      relations: [
        'product',
        'invenstory',
        'product.images',
        'product_types',
        'promotions',
      ], // Load các liên kết cần thiết
    });

    if (!batch) throw new NotFoundException('Batch not found');

    // Cập nhật thông tin cơ bản
    Object.assign(batch, {
      batch_number: dto.batch_number || batch.batch_number,
      quantity: dto.quantity || batch.quantity,
      manufactured_date: dto.manufactured_date
        ? new Date(dto.manufactured_date)
        : batch.manufactured_date,
      expiry_date: dto.expiry_date
        ? new Date(dto.expiry_date)
        : batch.expiry_date,
      low_stock_threshold: dto.low_stock_threshold || batch.low_stock_threshold,
      unit_product_price: dto.unit_product_price || batch.unit_product_price,
      is_active: dto.is_active ?? batch.is_active,
    });

    // Cập nhật ProductType nếu có
    if (dto.product_type_id) {
      const productType = await this.productTypeRepo.findOne({
        where: { product_type_id: dto.product_type_id },
      });
      if (!productType) throw new NotFoundException('Product type not found');
      batch.product_types = productType;
    }

    // Cập nhật Product nếu có
    if (dto.product_id) {
      const product = await this.productRepo.findOne({
        where: { product_id: dto.product_id },
      });
      if (!product) throw new NotFoundException('Product not found');
      batch.product = product;
    }

    // Cập nhật Promotions nếu có
    if (dto.promotion_ids && dto.promotion_ids.length > 0) {
      const promotions = await this.promotionRepo.findBy({
        promotion_id: In(dto.promotion_ids),
      });
      if (promotions.length !== dto.promotion_ids.length) {
        throw new NotFoundException('Some promotions not found');
      }
      batch.promotions = promotions;
    }

    return this.batchRepo.save(batch);
  }

  // async updateBatchs(updateDatas: Partial<UpdateBatchProductDto[]>) {
  //   if (!updateDatas || updateDatas.length === 0) {
  //     throw new NotFoundException('No batches to update');
  //   }
  //   const batchIds = updateDatas.map((data) => data?.batch_id);
  //   const batches = await this.batchRepo.findBy({
  //     batch_id: In(batchIds),
  //     is_deleted: false,
  //   });
  //   if (batches.length === 0) throw new NotFoundException('Batches not found');

  //   batches.forEach((batch, index) => Object.assign(batch, updateDatas[index]));
  //   return this.batchRepo.save(batches);
  // }

  async remove(id: string) {
    const batch = await this.batchRepo.findOne({
      where: { batch_id: id, is_deleted: false },
    });
    if (!batch) throw new NotFoundException('Batch not found');
    batch.is_deleted = true;
    await this.batchRepo.save(batch);
    return { deleted: true };
  }

  async findExpiringSoon(days: number) {
    const now = new Date();
    const soon = new Date();
    soon.setDate(now.getDate() + days);
    return this.batchRepo.find({
      where: {
        expiry_date: LessThanOrEqual(soon),
        is_active: true,
        is_deleted: false,
      },
      relations: ['product', 'invenstory'],
    });
  }

  async findLowStock() {
    return this.batchRepo
      .createQueryBuilder('batch')
      .where('batch.quantity <= batch.low_stock_threshold')
      .andWhere('batch.is_active = :active', { active: true })
      .andWhere('batch.is_deleted = :deleted', { deleted: false })
      .leftJoinAndSelect('batch.product', 'product')
      .leftJoinAndSelect('batch.invenstory', 'invenstory')
      .getMany();
  }

  async decreaseQuantity(batchId: string, amount: number) {
    const batch = await this.batchRepo.findOne({
      where: { batch_id: batchId, is_deleted: false },
    });
    if (!batch) throw new NotFoundException('Batch not found');
    if (batch.quantity < amount)
      throw new Error('Not enough quantity in batch');
    batch.quantity -= amount;
    return this.batchRepo.save(batch);
  }
}
