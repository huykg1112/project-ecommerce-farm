import { PartialType } from '@nestjs/mapped-types';
import { CreateInvenstoryDto } from './create-invenstory.dto';

export class UpdateInvenstoryDto extends PartialType(CreateInvenstoryDto) {}
