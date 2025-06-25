import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { validate as isUUID } from 'uuid'; // Lý do: Thêm kiểm tra UUID
import { TokenService } from './token.service';

@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get(':user_id')
  async getTokenByUserId(@Param('user_id') user_id: string): Promise<any> {
    if (!isUUID(user_id)) {
      throw new NotFoundException('Invalid userId format'); // Lý do: Kiểm tra UUID để tăng tính an toàn
    }
    const tokens = await this.tokenService.findAllByUserId(user_id);
    if (!tokens || tokens.length === 0) {
      // Lý do: Sửa điều kiện để chính xác hơn khi không có token
      throw new NotFoundException(
        `Không tìm thấy token cho user với ID ${user_id}`,
      );
    }
    return tokens;
  }
}
