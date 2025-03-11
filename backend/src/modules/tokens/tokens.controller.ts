import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@root/src/auth/jwt-auth.guard';
import { validate as isUUID } from 'uuid'; // Lý do: Thêm kiểm tra UUID
import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get(':userId')
  async getTokenByUserId(@Param('userId') userId: string): Promise<any> {
    if (!isUUID(userId)) {
      throw new NotFoundException('Invalid userId format'); // Lý do: Kiểm tra UUID để tăng tính an toàn
    }
    const tokens = await this.tokensService.findAllByUserId(userId);
    if (!tokens || tokens.length === 0) {
      // Lý do: Sửa điều kiện để chính xác hơn khi không có token
      throw new NotFoundException(
        `Không tìm thấy token cho user với ID ${userId}`,
      );
    }
    return tokens;
  }
}
