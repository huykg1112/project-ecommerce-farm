import { IsBoolean, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Email không hợp lệ',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]\d{1,14}$/, { message: 'Số điện thoại không hợp lệ' })
  phone?: string;

  @IsOptional()
  @IsString()
  // @Matches(/^\d{12}$/, { message: 'CCCD không hợp lệ' })
  cccd?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsString()
  // @Matches(/^[A-Z0-9]+$/, { message: 'Giấy phép kinh doanh không hợp lệ' })
  license?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive phải là boolean' })
  isActive?: boolean;
}
