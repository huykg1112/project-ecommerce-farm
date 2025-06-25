// src/modules/users/dto/assign-role.dto.ts
import { IsUUID, IsOptional } from 'class-validator';

export class AssignRoleDto {
  @IsUUID(4, { message: 'Role ID phải là UUID hợp lệ' })
  role_id: string;

  @IsOptional()
  @IsUUID(4, { message: 'User ID phải là UUID hợp lệ' })
  user_id?: string; // Tùy chọn, nếu không cung cấp sẽ lấy từ token
}
