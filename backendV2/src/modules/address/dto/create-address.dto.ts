import {
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAddressDto {
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  @IsOptional()
  address_detail?: string;

  @IsNumber({ allowNaN: false }, { message: 'Vĩ độ phải là số' })
  @IsLatitude({ message: 'Vĩ độ không hợp lệ' })
  @IsOptional()
  latitude?: number;

  @IsNumber({ allowNaN: false }, { message: 'Kinh độ phải là số' })
  @IsLongitude({ message: 'Kinh độ không hợp lệ' })
  @IsOptional()
  longitude?: number;

  @IsBoolean({ message: 'Trạng thái mặc định phải là boolean' })
  @IsOptional()
  is_default?: boolean;
}
