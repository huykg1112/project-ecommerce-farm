import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  @IsOptional()
  address_detail?: string;

  @IsNumber({ allowNaN: false }, { message: 'Vĩ độ phải là số' })
  @IsOptional()
  latitude?: number;

  @IsNumber({ allowNaN: false }, { message: 'Kinh độ phải là số' })
  @IsOptional()
  longitude?: number;

  @IsBoolean({ message: 'Trạng thái mặc định phải là boolean' })
  @IsOptional()
  is_default?: boolean;
}
