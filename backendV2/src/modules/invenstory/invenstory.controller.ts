import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvenstoryService } from './invenstory.service';
import { CreateInvenstoryDto } from './dto/create-invenstory.dto';
import { UpdateInvenstoryDto } from './dto/update-invenstory.dto';

@Controller('invenstory')
export class InvenstoryController {
  constructor(private readonly invenstoryService: InvenstoryService) {}

  @Post()
  create(@Body() createInvenstoryDto: CreateInvenstoryDto) {
    return this.invenstoryService.create(createInvenstoryDto);
  }

  @Get()
  findAll() {
    return this.invenstoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invenstoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvenstoryDto: UpdateInvenstoryDto) {
    return this.invenstoryService.update(+id, updateInvenstoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invenstoryService.remove(+id);
  }
}
