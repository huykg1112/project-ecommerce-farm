import { Expose, Type } from 'class-transformer';

export class BatchProductDto {
  @Expose()
  batch_id: string;

  @Expose()
  batch_number: string;

  @Expose()
  expiry_date: Date;

  @Expose()
  product: {
    product_id: string;
    product_name: string;
    image_url: string;
    unit: string;
  };
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
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  @Type(() => BatchProductDto)
  batch_product: BatchProductDto;
}
