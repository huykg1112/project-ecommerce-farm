import { Expose, Type } from 'class-transformer';
import { User } from '../../users/entities/user.entity';

export class ProductsComboSerializer {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  originalPrice!: number;

  @Expose()
  discountPrice!: number;

  @Expose()
  discountPercentage!: number;

  @Expose()
  isActive!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  @Type(() => ProductSerializer)
  products!: ProductSerializer[];

  @Expose()
  @Type(() => DistributorSerializer)
  distributor!: User;
}

export class ProductSerializer {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  price!: number;

  @Expose()
  image!: string;

  @Expose()
  stock!: number;
}

export class DistributorSerializer {
  @Expose()
  id!: string;

  @Expose()
  fullName!: string;

  @Expose()
  phone!: string;

  @Expose()
  address!: string;
} 