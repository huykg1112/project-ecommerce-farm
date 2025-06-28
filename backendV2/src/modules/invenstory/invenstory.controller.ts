import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateInvenstoryDto } from './dto/create-invenstory.dto';
import { UpdateInvenstoryDto } from './dto/update-invenstory.dto';
import { InvenstoryService } from './invenstory.service';

@Controller('invenstory')
export class InvenstoryController {
  constructor(private readonly invenstoryService: InvenstoryService) {}

  @Post()
  async create(@Body() createInvenstoryDto: CreateInvenstoryDto) {
    return await this.invenstoryService.create(createInvenstoryDto);
  }

  @Get()
  async findAll() {
    return await this.invenstoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.invenstoryService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInvenstoryDto: UpdateInvenstoryDto,
  ) {
    return await this.invenstoryService.update(id, updateInvenstoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.invenstoryService.remove(id);
  }
}
