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
    if (!req.user || req.user.role?.role_name !== 'admin')
      throw new ForbiddenException('Admin only');
    return await this.storeOwnerRequestService.findAll();
  }

  // Admin or owner: get one request
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const request = await this.storeOwnerRequestService.findOne(id);
    if (
      req.user.role?.role_name !== 'admin' &&
      req.user.user_id !== request.user.user_id
    ) {
      throw new ForbiddenException('Forbidden');
    }
    return request;
  }

  // Admin: approve/reject
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { approve: boolean },
    @Req() req,
  ) {
    if (!req.user || req.user.role?.role_name !== 'admin')
      throw new ForbiddenException('Admin only');
    return await this.storeOwnerRequestService.update(
      id,
      req.user.user_id,
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
