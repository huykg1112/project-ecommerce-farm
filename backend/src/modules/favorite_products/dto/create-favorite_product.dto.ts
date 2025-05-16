import { User } from '@modules/users/entities/user.entity';
import { Product } from '@root/src/modules/product/entities/product.entity';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateFavoriteProductDto {
  @IsOptional()
  @IsUUID()
  user?: User;

  @IsNotEmpty()
  @IsUUID()
  product!: Product;
}
