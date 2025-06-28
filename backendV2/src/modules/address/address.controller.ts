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
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto, @Req() req) {
    if (!req.user || !req.user.user_id) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }
    return this.addressService.create(req.user.user_id, createAddressDto);
  }

  @Get()
  findAll(@Req() req) {
    if (!req.user || !req.user.user_id) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }
    return this.addressService.findAll(req.user.user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    if (!req.user || !req.user.user_id) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }
    return this.addressService.findOne(req.user.user_id, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Req() req,
  ) {
    if (!req.user || !req.user.user_id) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }
    return this.addressService.update(req.user.user_id, id, updateAddressDto);
  }

  @Patch(':id/set-default')
  setDefault(@Param('id') id: string, @Req() req) {
    if (!req.user || !req.user.user_id) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }
    return this.addressService.setDefault(req.user.user_id, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    if (!req.user || !req.user.user_id) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }
    return this.addressService.remove(req.user.user_id, id);
  }
}
