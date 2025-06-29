import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Email không hợp lệ',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]\d{1,14}$/, { message: 'Số điện thoại không hợp lệ' })
  phone_number?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  cccd?: string;

  @IsOptional()
  @IsBoolean({ message: 'is_active phải là boolean' })
  is_active?: boolean;

  @IsOptional()
  @IsString()
  license_number?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  // @IsOptional()
  // @IsObject({ message: 'Địa chỉ phải là object' })
  // address?: Partial<Address>;
}
