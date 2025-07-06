import { PartialType } from '@nestjs/mapped-types';
import { CreateBatchProductDto } from './create-batch-product.dto';

export class UpdateBatchProductDto extends PartialType(CreateBatchProductDto) {}
