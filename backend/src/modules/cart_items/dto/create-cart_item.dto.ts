import { User } from '@modules/users/entities/user.entity';
import { Product } from '@root/src/modules/product/entities/product.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  quantity!: number;

  @IsOptional()
  @IsUUID()
  user?: User;

  @IsNotEmpty()
  @IsUUID()
  product!: Product;
}
