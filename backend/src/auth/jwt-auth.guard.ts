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
    const publicKey = this.configService.get<string>('IS_PUBLIC_KEY');
    const isPublic = this.reflector.getAllAndOverride<boolean>(publicKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token không hợp lệ hoặc thiếu');
    }

    const token = authHeader.split(' ')[1];

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded: JwtPayload = this.jwtService.verify(token, { secret });

      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const [user, storedToken] = await Promise.all([
        this.userService.findById(decoded.sub),
        this.tokenService.findByAccessToken(token),
      ]);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Người dùng không tồn tại hoặc bị khóa');
      }

      if (!storedToken || storedToken.accessToken !== token) {
        throw new UnauthorizedException('Token không hợp lệ hoặc đã bị vô hiệu hóa');
      }

      if (storedToken.accessTokenExpiresAt && storedToken.accessTokenExpiresAt < new Date()) {
        throw new UnauthorizedException('Token đã hết hạn');
      }

      // Attach user to request object
      request.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}
