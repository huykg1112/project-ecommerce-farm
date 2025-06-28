import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { ProductType } from './entities/product-type.entity';

export enum ProductTypeEnum {
  THUOC_BVTV = 'THUOC_BVTV', // Sản phẩm thuốc bảo vệ thực vật
  PHAN_BON = 'PHAN_BON', // Sản phẩm phân bón
}

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,
  ) {}

  async create(createProductTypeDto: CreateProductTypeDto) {
    if (
      ![ProductTypeEnum.THUOC_BVTV, ProductTypeEnum.PHAN_BON].includes(
        createProductTypeDto.type_name as any,
      )
    ) {
      throw new BadRequestException(
        'Chỉ cho phép loại sản phẩm THUOC_BVTV hoặc PHAN_BON',
      );
    }
    // Kiểm tra trùng tên
    const existed = await this.productTypeRepository.findOne({
      where: { type_name: createProductTypeDto.type_name },
    });
    if (existed) {
      throw new BadRequestException('Loại sản phẩm này đã tồn tại');
    }
    const type = this.productTypeRepository.create(createProductTypeDto);
    const saved = await this.productTypeRepository.save(type);
    return {
      message: 'Tạo loại sản phẩm thành công',
      data: saved,
    };
  }

  async findAll() {
    const types = await this.productTypeRepository.find({
      order: { created_at: 'ASC' },
    });
    return {
      message: 'Lấy danh sách loại sản phẩm thành công',
      data: types,
      total: types.length,
    };
  }

  async findOne(id: string) {
    const type = await this.productTypeRepository.findOne({
      where: { product_type_id: id },
    });
    if (!type) {
      throw new NotFoundException(`Không tìm thấy loại sản phẩm với id: ${id}`);
    }
    return {
      message: 'Lấy thông tin loại sản phẩm thành công',
      data: type,
    };
  }

  async update(id: string, updateProductTypeDto: UpdateProductTypeDto) {
    if (
      updateProductTypeDto.type_name &&
      ![ProductTypeEnum.THUOC_BVTV, ProductTypeEnum.PHAN_BON].includes(
        updateProductTypeDto.type_name as any,
      )
    ) {
      throw new BadRequestException(
        'Chỉ cho phép loại sản phẩm THUOC_BVTV hoặc PHAN_BON',
      );
    }
    const type = await this.productTypeRepository.findOne({
      where: { product_type_id: id },
    });
    if (!type) {
      throw new NotFoundException(`Không tìm thấy loại sản phẩm với id: ${id}`);
    }
    Object.assign(type, updateProductTypeDto);
    const updated = await this.productTypeRepository.save(type);
    return {
      message: 'Cập nhật loại sản phẩm thành công',
      data: updated,
    };
  }

  async remove(id: string) {
    const type = await this.productTypeRepository.findOne({
      where: { product_type_id: id },
    });
    if (!type) {
      throw new NotFoundException(`Không tìm thấy loại sản phẩm với id: ${id}`);
    }
    type.is_active = false;
    await this.productTypeRepository.save(type);
    return {
      message: 'Đã ẩn loại sản phẩm thành công',
      data: { product_type_id: id },
    };
  }

  async restore(id: string) {
    const type = await this.productTypeRepository.findOne({
      where: { product_type_id: id },
    });
    if (!type) {
      throw new NotFoundException(`Không tìm thấy loại sản phẩm với id: ${id}`);
    }
    type.is_active = true;
    await this.productTypeRepository.save(type);
    return {
      message: 'Khôi phục loại sản phẩm thành công',
      data: { product_type_id: id },
    };
  }
}
