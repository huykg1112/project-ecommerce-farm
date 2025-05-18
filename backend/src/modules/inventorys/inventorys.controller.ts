import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put
} from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { InventorysService } from './inventorys.service';

@Controller('inventorys')
export class InventorysController {
  constructor(private readonly inventorysService: InventorysService) {}

  @Post()
  async create(
    @Body() createInventoryDto: CreateInventoryDto,
  ): Promise<Inventory> {
    return this.inventorysService.create(createInventoryDto);
  }

  @Get()
  async findAll(): Promise<Inventory[]> {
    return this.inventorysService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Inventory> {
    return this.inventorysService.findOne(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<Inventory[]> {
    return this.inventorysService.findByUserId(userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    return this.inventorysService.update(id, updateInventoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.inventorysService.remove(id);
  }

  @Patch(':id/approve')
  
  async approve(@Param('id') id: string): Promise<Inventory> {
    return this.inventorysService.approve(id);
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string): Promise<Inventory> {
    return this.inventorysService.reject(id);
  }
}
