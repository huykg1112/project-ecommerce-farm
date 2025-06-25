import { SetMetadata } from '@nestjs/common';

// Không thể dùng ConfigService trực tiếp trong decorator, nên để key tạm thời là một giá trị mặc định
// Giá trị thực sẽ được lấy trong JwtAuthGuard
export const IS_PUBLIC_KEY = 'isPublic'; // Giá trị mặc định, sẽ được override trong guard
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
