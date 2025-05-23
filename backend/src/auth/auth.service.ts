import { TokensService } from '@modules/tokens/tokens.service'; // Thêm TokenService
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Token } from '../modules/tokens/entities/token.entity';
import { User } from '../modules/users/entities/user.entity';
import { UserService } from '../modules/users/user.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokensService, // Inject TokenService
    private readonly jwtService: JwtService,
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
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '15', 10);
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
  async googleLogin(
    googleUser: any,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      // Kiểm tra xem user đã tồn tại qua email
      let user = await this.userService.userRepository.findOne({
        where: { email: googleUser.email },
        relations: ['role'],
      });

      if (!user) {
        // Nếu chưa tồn tại, tạo user mới
        const role = await this.userService.rolesService.findByName('Client');
        if (!role) {
          // Tạo vai trò Client nếu chưa tồn tại
          const createRoleDto = {
            name: 'Client',
            description: 'Vai trò mặc định cho khách hàng',
          };
          await this.userService.rolesService.createRole(createRoleDto);
        }

        user = this.userService.userRepository.create({
          username: googleUser.email, // Hoặc tạo username duy nhất nếu cần
          email: googleUser.email,
          fullName: googleUser.fullName || 'Google User',
          password: '', // Không cần mật khẩu
          isActive: true,
          role: await this.userService.rolesService.findByName('Client'),
        });

        try {
          user = await this.userService.userRepository.save(user);
        } catch (error) {
          throw new BadRequestException(
            `Không thể tạo người dùng: ${error.message}`,
          );
        }
      }

      // Tạo token cho user
      const payload = { username: user.username, sub: user.id };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
      const hashedRefreshToken = await this.hashRefreshToken(refreshToken);

      await this.tokenService.createForUser(
        user.id,
        accessToken,
        hashedRefreshToken,
      );

      return { access_token: accessToken, refresh_token: refreshToken };
    } catch (error) {
      console.error('Google login error:', error);
      throw new BadRequestException(
        `Đăng nhập Google thất bại: ${error.message}`,
      );
    }
  }
}
