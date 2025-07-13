import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BatchProduct } from '../batch-product/entities/batch-product.entity';
import { User } from '../user/entities/user.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from './entities/promotion.entity';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(BatchProduct)
    private readonly batchProductRepository: Repository<BatchProduct>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto, distributor_id: string) {
    // Kiểm tra distributor tồn tại
    const distributor = await this.userRepository.findOne({
      where: { user_id: distributor_id },
    });
    if (!distributor) throw new NotFoundException('Không tìm thấy distributor');

    // Lấy các batch_product thuộc về distributor này
    const batchProducts = await this.batchProductRepository.find({
      where: { batch_id: In(createPromotionDto.batch_product_ids) },
      relations: ['product', 'product.distributor'],
    });
    const validBatchProducts = batchProducts.filter(
      (b) =>
        b.product &&
        b.product.distributor &&
        b.product.distributor.user_id === distributor_id,
    );
    if (
      validBatchProducts.length !== createPromotionDto.batch_product_ids.length
    ) {
      throw new ForbiddenException(
        'Bạn chỉ có thể tạo promotion cho sản phẩm của mình',
      );
    }

    const promotion = this.promotionRepository.create({
      ...createPromotionDto,
      start_date: new Date(createPromotionDto.start_date),
      end_date: new Date(createPromotionDto.end_date),
      created_by: distributor,
      batch_products: validBatchProducts,
    });
    const saved = await this.promotionRepository.save(promotion);
    return {
      message: 'Tạo chương trình khuyến mãi thành công',
      data: saved,
    };
  }

  async findAllByDistributor(distributor_id: string) {
    const promotions = await this.promotionRepository.find({
      where: {
        created_by: { user_id: distributor_id },
        is_active: true,
        is_deleted: false,
      },
      relations: ['created_by', 'batch_products'],
      order: { created_at: 'DESC' },
    });
    return promotions;
  }

  async findAll() {
    const promotions = await this.promotionRepository.find({
      where: { is_deleted: false },
      relations: ['created_by', 'batch_products'],
      order: { created_at: 'DESC' },
    });
    return {
      message: 'Lấy danh sách chương trình khuyến mãi thành công',
      data: promotions,
      total: promotions.length,
    };
  }
  async findActivePromotions() {
    const promotions = await this.promotionRepository.find({
      where: { is_active: true, is_deleted: false },
      relations: ['created_by', 'batch_products'],
      order: { created_at: 'DESC' },
    });
    return {
      message:
        'Lấy danh sách chương trình khuyến mãi đang hoạt động thành công',
      data: promotions,
      total: promotions.length,
    };
  }

  async findOne(id: string) {
    const promotion = await this.promotionRepository.findOne({
      where: { promotion_id: id, is_deleted: false },
      relations: ['created_by', 'batch_products'],
    });
    if (!promotion) {
      throw new NotFoundException(`Không tìm thấy chương trình với id: ${id}`);
    }
    return {
      message: 'Lấy thông tin chương trình khuyến mãi thành công',
      data: promotion,
    };
  }

  async update(
    id: string,
    updatePromotionDto: UpdatePromotionDto,
    distributor_id: string,
  ) {
    const promotion = await this.promotionRepository.findOne({
      where: { promotion_id: id, is_deleted: false },
      relations: ['created_by', 'batch_products'],
    });
    if (!promotion) {
      throw new NotFoundException(`Không tìm thấy chương trình với id: ${id}`);
    }
    if (promotion.created_by.user_id !== distributor_id) {
      throw new ForbiddenException('Bạn không có quyền sửa chương trình này');
    }
    // Nếu cập nhật batch_product_ids
    let batchProducts = promotion.batch_products;
    if (updatePromotionDto.batch_product_ids) {
      const updateBatchProducts = await this.batchProductRepository.find({
        where: { batch_id: In(updatePromotionDto.batch_product_ids) },
        relations: ['product', 'product.distributor'],
      });
      batchProducts = updateBatchProducts.filter(
        (b) =>
          b.product &&
          b.product.distributor &&
          b.product.distributor.user_id === distributor_id,
      );
      if (
        batchProducts.length !== updatePromotionDto.batch_product_ids.length
      ) {
        throw new ForbiddenException(
          'Bạn chỉ có thể áp dụng promotion cho sản phẩm của mình',
        );
      }
    }
    Object.assign(promotion, updatePromotionDto);
    if (updatePromotionDto.start_date)
      promotion.start_date = new Date(updatePromotionDto.start_date);
    if (updatePromotionDto.end_date)
      promotion.end_date = new Date(updatePromotionDto.end_date);
    promotion.batch_products = batchProducts;
    const updated = await this.promotionRepository.save(promotion);
    return {
      message: 'Cập nhật chương trình khuyến mãi thành công',
      data: updated,
    };
  }

  async remove(id: string, distributor_id: string) {
    const promotion = await this.promotionRepository.findOne({
      where: { promotion_id: id, is_deleted: false },
      relations: ['created_by'],
    });
    if (!promotion) {
      throw new NotFoundException(`Không tìm thấy chương trình với id: ${id}`);
    }
    if (promotion.created_by.user_id !== distributor_id) {
      throw new ForbiddenException('Bạn không có quyền xóa chương trình này');
    }
    promotion.is_active = false;
    promotion.is_deleted = true; // Đánh dấu là đã xóa
    await this.promotionRepository.save(promotion);
    return {
      message: 'Đã ẩn chương trình khuyến mãi thành công',
      data: { promotion_id: id },
    };
  }
}
