import {
      CanActivate,
      ExecutionContext,
      ForbiddenException,
      Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../modules/users/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Không tìm thấy thông tin người dùng');
    }

    const userRole = await this.userService.getUserRole(user.id);
    
    if (!userRole || !userRole.role) {
      throw new ForbiddenException('Người dùng không có vai trò');
    }

    const hasRole = requiredRoles.includes(userRole.role.name);
    
    if (!hasRole) {
      throw new ForbiddenException('Bạn không có quyền truy cập vào tài nguyên này');
    }

    return true;
  }
} 