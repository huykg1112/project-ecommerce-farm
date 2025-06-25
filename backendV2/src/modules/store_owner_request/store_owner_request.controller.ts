import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoreOwnerRequestService } from './store_owner_request.service';
import { CreateStoreOwnerRequestDto } from './dto/create-store_owner_request.dto';
import { UpdateStoreOwnerRequestDto } from './dto/update-store_owner_request.dto';

@Controller('store-owner-request')
export class StoreOwnerRequestController {
  constructor(private readonly storeOwnerRequestService: StoreOwnerRequestService) {}

  @Post()
  create(@Body() createStoreOwnerRequestDto: CreateStoreOwnerRequestDto) {
    return this.storeOwnerRequestService.create(createStoreOwnerRequestDto);
  }

  @Get()
  findAll() {
    return this.storeOwnerRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeOwnerRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreOwnerRequestDto: UpdateStoreOwnerRequestDto) {
    return this.storeOwnerRequestService.update(+id, updateStoreOwnerRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeOwnerRequestService.remove(+id);
  }
}
