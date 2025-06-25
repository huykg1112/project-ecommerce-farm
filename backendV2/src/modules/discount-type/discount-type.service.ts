import { Injectable } from '@nestjs/common';
import { CreateDiscountTypeDto } from './dto/create-discount-type.dto';
import { UpdateDiscountTypeDto } from './dto/update-discount-type.dto';

@Injectable()
export class DiscountTypeService {
  create(createDiscountTypeDto: CreateDiscountTypeDto) {
    return 'This action adds a new discountType';
  }

  findAll() {
    return `This action returns all discountType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discountType`;
  }

  update(id: number, updateDiscountTypeDto: UpdateDiscountTypeDto) {
    return `This action updates a #${id} discountType`;
  }

  remove(id: number) {
    return `This action removes a #${id} discountType`;
  }
}
