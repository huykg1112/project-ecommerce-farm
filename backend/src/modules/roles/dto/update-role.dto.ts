import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsBoolean({ message: 'isActive phải là boolean' })
  @IsOptional()
  isActive?: boolean; // Lý do: Chỉ thêm isActive, để name và description tùy chọn từ PartialType
}
