import {
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
  UnauthorizedException,
} from '@nestjs/common';
import { Public } from '@root/src/public.decorator';
import {
  DistributorProfileType,
  UserProfileType,
} from '@root/src/serializers/TypeSerializer/UserProfile.type';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserService } from './user.service';

// @UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(@Query() filters: UserFiltersDto) {
    return this.userService.getUsers(filters);
  }

  @Public()
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    console.log(registerUserDto);
    return this.userService.registerUser(registerUserDto);
  }

  @Get('profile')
  getProfile(@Req() req): Promise<UserProfileType | DistributorProfileType> {
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
  findOne(@Query('id') id: string) {
    return this.userService.findUserById(id);
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

  //management user

  @Get('findAll')
  findAll() {
    return this.userService.findAllUsers();
  }

  @Put('changeRole')
  changeRole(@Body() body: { user_id: string; roleId: string }) {
    return this.userService.changeRole(body.user_id, body.roleId);
  }

  @Put('updateUser/:id')
  updateUser(
    @Body() updateProfileDto: UpdateProfileDto,
    @Param('id') id: string,
  ) {
    console.log('updateProfileDto', updateProfileDto);
    return this.userService.updateProfile(id, updateProfileDto);
  }

  @Put('updateUserStatus/:id')
  updateUserStatus(@Param('id') id: string) {
    return this.userService.updateUserStatus(id);
  }

  @Delete('deleteUser/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  /*
  body API:
  {
    "user_id": "1",
    "roleId": "1"
  }
  */
}
