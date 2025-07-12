import { Expose, Type } from 'class-transformer';

export class OrderUserDto {
  @Expose()
  user_id: string;

  @Expose()
  full_name: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;
}

export class OrderDistributorDto {
  @Expose()
  user_id: string;

  @Expose()
  full_name: string;

  @Expose()
  phone: string;
}

export class OrderStatusDto {
  @Expose()
  status_id: string;

  @Expose()
  status_name: string;

  @Expose()
  description: string;
}

export class OrderPaymentMethodDto {
  @Expose()
  payment_method_id: string;

  @Expose()
  method_name: string;

  @Expose()
  description: string;
}

export class OrderDetailResponseDto {
  @Expose()
  order_detail_id: string;

  @Expose()
  quantity: number;

  @Expose()
  unit_price: number;

  @Expose()
  subtotal: number;

  @Expose()
  notes: string;

  @Expose()
  batch_product: {
    batch_id: string;
    batch_number: string;
    product: {
      product_id: string;
      product_name: string;
      image_url: string;
    };
  };
}

export class OrderResponseDto {
  @Expose()
  order_id: string;

  @Expose()
  order_code: string;

  @Expose()
  total_amount: number;

  @Expose()
  notes: string;

  @Expose()
  shipping_address: string;

  @Expose()
  estimated_delivery_date: Date;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  @Type(() => OrderUserDto)
  user: OrderUserDto;

  @Expose()
  @Type(() => OrderDistributorDto)
  distributor: OrderDistributorDto;

  @Expose()
  @Type(() => OrderStatusDto)
  status: OrderStatusDto;

  @Expose()
  @Type(() => OrderPaymentMethodDto)
  payment_method: OrderPaymentMethodDto;

  @Expose()
  @Type(() => OrderDetailResponseDto)
  order_details: OrderDetailResponseDto[];
}
