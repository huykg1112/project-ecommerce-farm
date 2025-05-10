import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Public } from '@root/src/public.decorator';
import { validate as isUUID } from 'uuid';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { UserProfileSerializer } from './serializers';
import { UserService } from './user.service';
// import { RequirePermission } from 'src/auth/require-permission.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req): Promise<UserProfileSerializer> {
    try {
      // Kiểm tra xem req.user có tồn tại không
      if (!req.user) {
        throw new UnauthorizedException('User not authenticated');
      }

      // Kiểm tra xem req.user.id có tồn tại không
      if (!req.user.id) {
        throw new UnauthorizedException('User ID not found');
      }

      const userId: string = req.user.id;
      const user = await this.userService.findById(userId);
      
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      return UserProfileSerializer.serialize(user);
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user profile');
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserProfileSerializer> {
    if (!isUUID(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return UserProfileSerializer.serialize(user);
  }

  @Public()
  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<Partial<User>> {
    // Partial<User> để trả về một phần của User
    const user = await this.userService.register(registerUserDto);
    return { username: user.username, email: user.email };
  }

  @Put('profile')
  async updateProfile(
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<{ message: string }> {
    const userId = req.user.id as string;
    return this.userService.updateUserProfile(userId, updateProfileDto);
  }

  @Patch('change-password')
  async changePassword(
    @Req() req,
    @Headers('authorization') authHeader: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.id as string;
    const currentAccessToken = authHeader?.split(' ')[1];
    if (!currentAccessToken)
      throw new NotFoundException('Authorization header missing');
    return this.userService.changePassword(
      userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
      currentAccessToken,
    );
  }

  @Put('assign-role')
  // @RequirePermission('assign_role')
  async assignRoleToUser(
    @Req() req,
    @Body() assignRoleDto: AssignRoleDto,
  ): Promise<{ message: string; user: Omit<User, 'password'> }> {
    const userId = assignRoleDto.userId || req.user.id;
    const updatedUser = await this.userService.assignRole(
      userId,
      assignRoleDto,
    );
    const { password, ...result } = updatedUser;
    return { message: 'Phân vai trò thành công', user: result };
  }

  @Get('role/get')
  // @RequirePermission('view_role')
  async getUserRole(
    @Req() req,
  ): Promise<{ role: { id: string; name: string } }> {
    const userId = req.user.id as string;
    return this.userService.getUserRole(userId);
  }

  @Delete(':id/role')
  // @RequirePermission('remove_role')
  async removeUserRole(@Param('id') id: string): Promise<{ message: string }> {
    if (!isUUID(id)) {
      throw new NotFoundException('Invalid ID format');
    }
    await this.userService.removeRole(id);
    return { message: 'Xóa vai trò thành công' };
  }
}
