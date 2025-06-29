import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Public } from '@root/src/public.decorator';
import { UserProfileType } from '@root/src/serializers/TypeSerializer/UserProfile.type';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';

// @UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.registerUser(registerUserDto);
  }

  @Get('profile')
  getProfile(@Req() req): Promise<UserProfileType> {
    if (!req.user) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }
    // Kiểm tra xem req.user.id có tồn tại không
    if (!req.user.user_id) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }
    return this.userService.getProfile(req.user.user_id);
  }

  @Get('findOne')
  findOne(@Req() req) {
    return this.userService.findUserById(req.user.user_id);
  }

  @Put('updateProfile')
  update(@Body() updateProfileDto: UpdateProfileDto, @Req() req) {
    // console.log(updateProfileDto);
    return this.userService.updateProfile(req.user.user_id, updateProfileDto);
  }

  @Patch('changePassword')
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req) {
    console.log(changePasswordDto);
    return this.userService.changePassword(req.user.user_id, changePasswordDto);
  }

  // lấy tất cả người dùng
  @Get('findAll')
  findAll() {
    return this.userService.findAllUsers();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(id);
  }
}
