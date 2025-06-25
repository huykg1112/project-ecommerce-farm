import { PartialType } from '@nestjs/mapped-types';
import { CreateBatchDto } from './create-batch-product.dto';

export class UpdateBatchDto extends PartialType(CreateBatchDto) {}
