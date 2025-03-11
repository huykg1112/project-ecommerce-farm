import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
} from '@nestjs/common';
import { RefreshTokenDto } from '../modules/users/dto/refresh-token.dto';
import { Public } from '../public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Đăng nhập
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Refresh token
  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string }> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  // Đăng xuất

  @Post('logout')
  async logout(@Request() req): Promise<{ message: string }> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Authorization header missing or invalid'); // Lý do: Kiểm tra header để tránh lỗi split
    }
    const accessToken = req.headers.authorization.split(' ')[1]; // Lấy token từ header
    await this.authService.logout(accessToken); // Truyền accessToken thay vì userId
    return { message: 'Đăng xuất thành công' };
  }
}
