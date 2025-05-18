import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertThresholdDto, ProductAlertDto } from './dto/alert.dto';
import { CreateProductBatchDto } from './dto/create-product_batch.dto';
import { UpdateProductBatchDto } from './dto/update-product_batch.dto';
import { ProductBatch } from './entities/product_batch.entity';

@Injectable()
export class ProductBatchesService {
  constructor(
    @InjectRepository(ProductBatch)
    private productBatchRepository: Repository<ProductBatch>,
  ) {}

  create(createProductBatchDto: CreateProductBatchDto) {
    return 'This action adds a new productBatch';
  }

  findAll() {
    return `This action returns all productBatches`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productBatch`;
  }

  update(id: number, updateProductBatchDto: UpdateProductBatchDto) {
    return `This action updates a #${id} productBatch`;
  }

  remove(id: number) {
    return `This action removes a #${id} productBatch`;
  }

  async getExpiringProducts(threshold: number = 30, distributorId?: string): Promise<ProductAlertDto[]> {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + threshold);

    const queryBuilder = this.productBatchRepository
      .createQueryBuilder('batch')
      .leftJoinAndSelect('batch.product', 'product')
      .leftJoinAndSelect('product.distributor', 'distributor')
      .where('batch.expiryDate <= :thresholdDate', { thresholdDate })
      .andWhere('batch.expiryDate > :today', { today })
      .andWhere('batch.isActive = :isActive', { isActive: true });

    if (distributorId) {
      queryBuilder.andWhere('product.distributor.id = :distributorId', { distributorId });
    }

    const expiringBatches = await queryBuilder.getMany();

    return expiringBatches.map(batch => ({
      id: batch.product.id,
      name: batch.product.name,
      batchCode: batch.batchCode,
      quantity: batch.quantity,
      expiryDate: batch.expiryDate,
      daysUntilExpiry: Math.ceil((batch.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      alertType: 'EXPIRY',
      distributorId: batch.product.distributor.id,
      distributorName: batch.product.distributor.fullName
    }));
  }

  async getLowStockProducts(threshold: number = 10, distributorId?: string): Promise<ProductAlertDto[]> {
    const queryBuilder = this.productBatchRepository
      .createQueryBuilder('batch')
      .leftJoinAndSelect('batch.product', 'product')
      .leftJoinAndSelect('product.distributor', 'distributor')
      .where('batch.quantity <= :threshold', { threshold })
      .andWhere('batch.isActive = :isActive', { isActive: true });

    if (distributorId) {
      queryBuilder.andWhere('product.distributor.id = :distributorId', { distributorId });
    }

    const lowStockBatches = await queryBuilder.getMany();

    return lowStockBatches.map(batch => ({
      id: batch.product.id,
      name: batch.product.name,
      batchCode: batch.batchCode,
      quantity: batch.quantity,
      expiryDate: batch.expiryDate,
      daysUntilExpiry: Math.ceil((batch.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      alertType: 'LOW_STOCK',
      distributorId: batch.product.distributor.id,
      distributorName: batch.product.distributor.fullName
    }));
  }

  async getAllAlerts(thresholds: AlertThresholdDto): Promise<ProductAlertDto[]> {
    const [expiringProducts, lowStockProducts] = await Promise.all([
      this.getExpiringProducts(thresholds.expiryDaysThreshold, thresholds.distributorId),
      this.getLowStockProducts(thresholds.stockThreshold, thresholds.distributorId)
    ]);

    return [...expiringProducts, ...lowStockProducts];
  }
}
