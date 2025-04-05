import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenDto } from '../modules/users/dto/refresh-token.dto';
import { Public } from '../public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard will handle the authentication
    console.log('Google Auth called');
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Request() req,
    @Res() res: import('express').Response,
  ): Promise<{ access_token: string; refresh_token: string } | undefined> {
    try {
      const token = await this.authService.googleLogin(req);
      const htpp =
        'http://localhost:3000/home?' +
        'access_token=' +
        token.access_token +
        '&' +
        'refresh_token=' +
        token.refresh_token;
      res.redirect(htpp); // Redirect to your frontend URL with tokens as query parameters
    } catch (error) {
      console.error('Google Auth Callback Error:', error);
      res.status(500).send('Internal Server Error');
      return undefined;
    }
  }

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
}
