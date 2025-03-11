import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Public } from '@root/src/public.decorator';
import { validate as isUUID } from 'uuid';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
// import { RequirePermission } from 'src/auth/require-permission.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req): Promise<Omit<User, 'password'>> {
    const userId: string = req.user.id as string;
    // console.log(req.user);
    return this.userService.findById(userId);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    if (!isUUID(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Public()
  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<Partial<User>> {
    // Partial<User> để trả về một phần của User
    const user = await this.userService.register(registerUserDto);
    const { password, ...result } = user;
    return result;
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
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const userId = req.user.id as string;
    const currentAccessToken = req.headers.authorization.split(' ')[1];
    if (!currentAccessToken) {
      throw new NotFoundException('Authorization header missing'); // Lý do: Kiểm tra header để tránh lỗi split undefined
    }
    return await this.userService.changePassword(
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
