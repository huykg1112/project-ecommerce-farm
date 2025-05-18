import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '@root/src/public.decorator';
import { validate as isUUID } from 'uuid';

import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterStoreDto } from './dto/register-store.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { UserProfileSerializer } from './serializers';
import { UserService } from './user.service';
// import { RequirePermission } from 'src/auth/require-permission.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('profile')
  async getProfile(@Req() req): Promise<UserProfileSerializer> {
    const userId: string = req.user.id as string;
    // console.log(req.user);
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return UserProfileSerializer.serialize(user);
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

  @Post('avatar')
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  }))
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const userId = req.user.id;
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(file);
      if (!result || !result.url || !result.public_id) {
        throw new BadRequestException('Failed to upload image to cloud storage');
      }

      const updatedUser = await this.userService.updateAvatar(userId, result.url, result.public_id);
      return {
        message: 'Avatar updated successfully',
        avatar: updatedUser.avatar,
      };
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw new BadRequestException(error.message || 'Failed to upload avatar');
    }
  }

  @Post('registerDistributor')
  async registerStore(@Body() registerStoreDto: RegisterStoreDto,
      @Req() req,
) {
    
    const user = await this.userService.registerStore(registerStoreDto, req.user.id);
    return {
      message: 'Đăng ký chủ đại lý thành công',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        role: user.role.name,
      },
    };
  }
}