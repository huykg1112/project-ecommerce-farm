import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Tên vai trò phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên vai trò không được để trống' })
  role_name: string;

  @IsString({ message: 'Mô tả phải là chuỗi' })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;
}
