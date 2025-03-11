import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Tên phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @IsString({ message: 'Mô tả phải là chuỗi' })
  @IsOptional()
  description: string;
}
