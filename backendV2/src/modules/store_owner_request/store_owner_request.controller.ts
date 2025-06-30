import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CreateStoreOwnerRequestDto } from './dto/create-store_owner_request.dto';
import { StoreOwnerRequestService } from './store_owner_request.service';

@Controller('store-owner-request')
export class StoreOwnerRequestController {
  constructor(
    private readonly storeOwnerRequestService: StoreOwnerRequestService,
  ) {}

  // User requests to become distributor
  @Post()
  async create(@Req() req, @Body() body: CreateStoreOwnerRequestDto) {
    if (!req.user || !req.user.user_id)
      throw new ForbiddenException('Unauthorized');
    return await this.storeOwnerRequestService.create(req.user.user_id, body);
  }

  // Admin: get all requests
  @Get()
  async findAll(@Req() req) {
    if (!req.user || req.user.role?.role_name !== 'Admin')
      throw new ForbiddenException('Chỉ admin mới có thể xem tất cả yêu cầu');
    return await this.storeOwnerRequestService.findAll();
  }

  // Admin or owner: get one request
  @Get('getOne')
  async findOne(@Body() body: { id: string }, @Req() req) {
    const request = await this.storeOwnerRequestService.findOne(body.id);
    if (req.user.role?.role_name !== 'Admin') {
      throw new ForbiddenException('Chỉ admin mới có thể xem yêu cầu của mình');
    }
    return request;
  }
  //người đăng ký xem yêu cầu của mình
  @Get('getMyRequest')
  async getMyRequest(@Req() req) {
    return await this.storeOwnerRequestService.getMyRequest(req.user.user_id);
  }

  // Admin: approve/reject
  @Patch('approve')
  async update(
    @Body() body: { request_id: string; approve: boolean },
    @Req() req,
  ) {
    if (!req.user || req.user.role?.role_name !== 'Admin')
      throw new ForbiddenException('Chỉ admin mới có thể phê duyệt yêu cầu');
    console.log(body);
    return await this.storeOwnerRequestService.update(
      body.request_id,
      body.approve,
    );
  }

  // Admin: delete request
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    if (!req.user || req.user.role?.role_name !== 'admin')
      throw new ForbiddenException('Admin only');
    return await this.storeOwnerRequestService.remove(id);
  }
}
