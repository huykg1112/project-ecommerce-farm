import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Redirect,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenDto } from '../modules/users/dto/refresh-token.dto';
import { Public } from '../public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // Đăng nhập
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Refresh token
  @Public()
  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string }> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  // Đăng xuất

  @Delete('logout')
  async logout(@Request() req): Promise<{ message: string }> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Authorization header missing or invalid'); // Lý do: Kiểm tra header để tránh lỗi split
    }
    const accessToken = req.headers.authorization.split(' ')[1]; // Lấy token từ header
    await this.authService.logout(accessToken); // Truyền accessToken thay vì userId
    return { message: 'Đăng xuất thành công' };
  }
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Không cần logic, AuthGuard sẽ redirect tới Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @Redirect() // Thêm decorator Redirect
  async googleLoginCallback(@Request() req) {
    const { access_token, refresh_token } = await this.authService.googleLogin(
      req.user,
    );
    const redirectUrl = this.configService.get<string>(
      'GOOGLE_FRONTEND_REDIRECT_URL',
    );
    return {
      url: `${redirectUrl}?access_token=${access_token}&refresh_token=${refresh_token}`,
    };
  }
}
