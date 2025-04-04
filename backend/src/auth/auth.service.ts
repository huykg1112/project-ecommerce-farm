import { TokensService } from '@modules/tokens/tokens.service'; // Thêm TokenService
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Token } from '../modules/tokens/entities/token.entity';
import { User } from '../modules/users/entities/user.entity';
import { UserService } from '../modules/users/user.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { MailsService } from '../modules/mails/mails.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokensService, // Inject TokenService
    private readonly jwtService: JwtService,
    private readonly mailService: MailsService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findByUsername(username);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException(
        'Tên người dùng hoặc mật khẩu không đúng',
      );
    if (!user.isActive)
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa');
    const { password: _, ...result } = user;
    return result;
  }

  async hashRefreshToken(token: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(token, saltRounds);
  }

  async compareRefreshToken(token: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(token, hashed);
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);
    const payload = { username: user.username, sub: user.id };

    // Xóa token hết hạn
    await this.tokenService.cleanExpiredTokens();

    // Tạo access token và refresh token mới
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const hashedRefreshToken = await this.hashRefreshToken(refreshToken);

    // Lưu token vào bảng Token
    await this.tokenService.createForUser(
      user.id,
      accessToken,
      hashedRefreshToken,
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string }> {
    const { refreshToken } = refreshTokenDto;
    let payload: { sub: string; username: string };
    try {
      payload = this.jwtService.verify(refreshToken) as {
        sub: string;
        username: string;
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
    const tokens = await this.tokenService.findAllByUserId(payload.sub);
    if (!tokens || tokens.length === 0) {
      throw new UnauthorizedException('Không tìm thấy token nào cho user này');
    }
    let matchedToken: Token | undefined;
    for (const token of tokens) {
      const isMatch = await this.compareRefreshToken(
        refreshToken,
        token.refreshToken || '',
      );
      if (isMatch) {
        matchedToken = token;
        break;
      }
    }
    if (!matchedToken) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    const newPayload = { username: payload.username, sub: payload.sub };
    const newAccessToken = this.jwtService.sign(newPayload, {
      expiresIn: '1h',
    });
    matchedToken.accessToken = newAccessToken;
    matchedToken.accessTokenExpiresAt = new Date(
      Date.now() + 1 * 60 * 60 * 1000,
    ); // 1 giờ
    await this.tokenService.save(matchedToken);

    return { access_token: newAccessToken };
  }

  async logout(accessToken: string): Promise<void> {
    const token = await this.tokenService.findByAccessToken(accessToken);
    if (token) {
      await this.tokenService.deleteByAccessToken(accessToken); // Xóa token
    }
  }
  async googleLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }

    let user = await this.userService.findByEmail(req.user.email);

    if (!user) {
      // Tạo user mới nếu chưa tồn tại
      user = await this.userService.createUserGoogle(
        req.user.email,
        `${req.user.firstName} ${req.user.lastName}`,
        true, // Google email đã được verify
      );

      // Gửi email xác thực cho lần đăng nhập đầu
      const verifyToken = this.jwtService.sign(
        { email: user.email },
        { expiresIn: '1d' },
      );
      await this.mailService.sendVerificationEmail(user.email, verifyToken);
    }

    return this.login({ username: user.username, password: user.password });
  }

  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.findByEmail(decoded.email);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      user.isVerified = true;
      await this.userService.saveUser(user);

      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const resetToken = this.jwtService.sign(
      { email: user.email },
      { expiresIn: '1h' },
    );

    await this.mailService.sendPasswordResetEmail(email, resetToken);
    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.findByEmail(decoded.email);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      await this.userService.changePassword(user.id, '', newPassword, '');
      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
