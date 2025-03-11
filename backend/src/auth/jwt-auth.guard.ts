import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from '../modules/tokens/tokens.service';
import { UserService } from '../modules/users/user.service';
import { IS_PUBLIC_KEY } from '../public.decorator'; // Import key mặc định

interface JwtPayload {
  sub: string;
  username: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokensService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Lấy IS_PUBLIC_KEY từ .env, nếu không có thì dùng giá trị mặc định từ auth.decorator.ts
    const publicKey =
      this.configService.get<string>('IS_PUBLIC_KEY') ?? IS_PUBLIC_KEY;

    // Kiểm tra metadata với key từ .env
    const isPublic = this.reflector.getAllAndOverride<boolean>(publicKey, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true; // Cho phép truy cập route công khai
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token không hợp lệ hoặc thiếu');
    }

    const token = authHeader.split(' ')[1];

    try {
      const secret =
        this.configService.get<string>('JWT_SECRET') ?? 'mysecretkey';
      const decoded: JwtPayload = this.jwtService.verify(token, { secret });

      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const [user, storedToken] = await Promise.all([
        this.userService.findById(decoded.sub),
        this.tokenService.findByAccessToken(token),
      ]);

      if (!user || !user.isActive) {
        throw new UnauthorizedException(
          'Người dùng không tồn tại hoặc bị khóa',
        );
      }

      if (
        !storedToken ||
        storedToken.accessToken !== token ||
        (storedToken.accessTokenExpiresAt &&
          storedToken.accessTokenExpiresAt < new Date())
      ) {
        throw new UnauthorizedException(
          'Token không hợp lệ hoặc đã bị vô hiệu hóa',
        );
      }

      const { password, ...result } = user;
      request.user = result;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}
