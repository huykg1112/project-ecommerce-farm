import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Public } from '@root/src/public.decorator';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
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
  getProfile(@Req() req): Promise<User> {
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

  @Patch('updateProfile')
  update(@Body() updateProfileDto: UpdateProfileDto, @Req() req) {
    return this.userService.updateProfile(req.user.user_id, updateProfileDto);
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
