import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoleGuard } from '../../auth/role.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { VouchersService } from './vouchers.service';
import { Public } from '@root/src/public.decorator';

@Controller('vouchers')
@UseGuards(RoleGuard)
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get()
  // @Roles('Admin', 'Distributor')
  @Public()
  async findAll() {
    return this.vouchersService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Distributor')
  async findOne(@Param('id') id: string) {
    return this.vouchersService.findOne(id);
  }

  @Post('create')
  @Roles('Admin', 'Distributor')
  async create(@Body() createVoucherDto: CreateVoucherDto, @Req() req) {
    return this.vouchersService.create(createVoucherDto, req.user.id);
  }


  @Get('validate/:code')
  async validateVoucher(
    @Param('code') code: string,
    @Req() req,
    @Body('orderAmount') orderAmount: number,
  ) {
    if (!orderAmount) {
      throw new BadRequestException('Cần cung cấp giá trị đơn hàng');
    }
    return this.vouchersService.validateVoucher(code, req.user.id, orderAmount);
  }

  @Post('apply/:code')
  @Roles('Admin', 'Distributor')
  async applyVoucher(
    @Param('code') code: string,
    @Req() req,
    @Body('orderAmount') orderAmount: number,
  ) {
    if (!orderAmount) {
      throw new BadRequestException('Cần cung cấp giá trị đơn hàng');
    }
    return this.vouchersService.applyVoucher(code, req.user.id, orderAmount);
  }
}
