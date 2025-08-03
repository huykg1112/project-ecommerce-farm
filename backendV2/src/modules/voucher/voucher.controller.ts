import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { Public } from '@root/src/public.decorator';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VoucherService } from './voucher.service';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto, @Request() req: any) {
    // Get distributor ID from JWT token or request
    const distributorId = req.user?.user_id;
    return this.voucherService.create(createVoucherDto, distributorId);
  }

  @Public()
  @Get()
  findAll(@Query('distributor_id') distributorId?: string) {
    return this.voucherService.findAll(distributorId);
  }

  @Get('my-vouchers')
  findMyVouchers(@Request() req: any) {
    const distributorId = req.user?.user_id;
    return this.voucherService.findAll(req.user.role?.role_name, distributorId);
  }

  @Get('my-vouchers-for-user')
  findMyVouchersForUser(@Request() req: any) {
    const userId = req.user?.user_id;
    return this.voucherService.findMyCollectedVouchers(userId);
  }

  @Public()
  @Get('for-users')
  findVouchersForUsers() {
    return this.voucherService.findVouchersForUsers();
  }

  //lấy voucher đã được người dùng thu thập của một nhà phân phối
  @Get('my-collected')
  findMyCollectedVouchers(
    @Request() req,
    @Query('distributorId') distributorId?: string,
  ) {
    const userId = req.user?.user_id;
    return this.voucherService.findMyCollectedVouchers(userId, distributorId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voucherService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVoucherDto: UpdateVoucherDto,
    @Request() req: any,
  ) {
    const distributorId = req.user?.user_id;
    return this.voucherService.update(id, updateVoucherDto, distributorId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const distributorId = req.user?.user_id;
    return this.voucherService.remove(id, distributorId);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string, @Request() req: any) {
    const distributorId = req.user?.user_id;
    return this.voucherService.toggleActive(id, distributorId);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.voucherService.findByCode(code);
  }

  @Post(':id/collect')
  collectVoucher(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.user_id;
    return this.voucherService.collectVoucher(id, userId);
  }

  @Patch('batch-toggle-status')
  batchToggleStatus(@Body('ids') ids: string[], @Request() req: any) {
    const distributorId = req.user?.user_id;
    return this.voucherService.batchToggleStatus(ids, distributorId);
  }

  @Delete('batch-delete')
  batchDelete(@Body('ids') ids: string[], @Request() req: any) {
    const distributorId = req.user?.user_id;
    return this.voucherService.batchDelete(ids, distributorId);
  }
}
