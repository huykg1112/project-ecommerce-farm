import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '@root/src/cloudinary/cloudinary.service';
import { Public } from '@root/src/public.decorator';
import {
  DistributorProfileType,
  UserProfileType,
} from '@root/src/serializers/TypeSerializer/UserProfile.type';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

// @UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async getUsers(@Query() filters: UserFiltersDto) {
    return await this.userService.getUsers(filters);
  }

  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    // console.log(registerUserDto);
    return await this.userService.registerUser(registerUserDto);
  }

  @Get('profile')
  async getProfile(
    @Req() req,
  ): Promise<UserProfileType | DistributorProfileType> {
    if (!req.user) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }
    // Kiểm tra xem req.user.id có tồn tại không
    if (!req.user.user_id) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }
    const profile = await this.userService.getProfile(req.user.user_id);
    // console.log('Profile:', profile);
    return profile;
  }

  @Get('findOne')
  findOne(@Query('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Put('updateProfile')
  async update(@Body() updateProfileDto: UpdateProfileDto, @Req() req) {
    // console.log(updateProfileDto);
    return await this.userService.updateProfile(
      req.user.user_id,
      updateProfileDto,
    );
  }

  @Patch('changePassword')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ) {
    // console.log(changePasswordDto);
    return await this.userService.changePassword(
      req.user.user_id,
      changePasswordDto,
    );
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  async uploadAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // console.log('File received:', file);
    console.log('User ID from request:', req.user);
    const userId = req.user.id;
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(file);
      if (!result || !result.url || !result.public_id) {
        throw new BadRequestException(
          'Failed to upload image to cloud storage',
        );
      }

      const updatedUser = await this.userService.updateAvatar(
        req.user as User,
        result.url,
        result.public_id,
      );
      return {
        message: 'Avatar updated successfully',
        avatar: updatedUser.avatar,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to upload avatar');
    }
  }

  //management user

  @Get('findAll')
  async findAll() {
    return await this.userService.findAllUsers();
  }

  @Put('changeRole')
  async changeRole(@Body() body: { user_id: string; roleId: string }) {
    return await this.userService.changeRole(body.user_id, body.roleId);
  }

  @Put('updateUser/:id')
  async updateUser(
    @Body() updateProfileDto: UpdateProfileDto,
    @Param('id') id: string,
  ) {
    return await this.userService.updateProfile(id, updateProfileDto);
  }

  @Put('updateUserStatus/:id')
  async updateUserStatus(@Param('id') id: string) {
    return await this.userService.updateUserStatus(id);
  }

  @Delete('deleteUser/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }

  /*
  body API:
  {
    "user_id": "1",
    "roleId": "1"
  }
  */
}
