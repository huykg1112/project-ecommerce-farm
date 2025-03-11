import { PartialType } from '@nestjs/mapped-types';
import { CreateFavoriteProductDto } from './create-favorite_product.dto';

export class UpdateFavoriteProductDto extends PartialType(CreateFavoriteProductDto) {}
