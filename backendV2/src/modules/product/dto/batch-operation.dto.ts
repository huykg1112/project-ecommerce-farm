import { IsArray, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class BatchProductDto {
  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  product_ids: string[];
}

export class BatchToggleStatusDto extends BatchProductDto {
  @IsBoolean()
  is_active: boolean;
}

export class BatchDeleteDto extends BatchProductDto {}
