import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscountTypeDto } from './create-discount-type.dto';

export class UpdateDiscountTypeDto extends PartialType(CreateDiscountTypeDto) {}
