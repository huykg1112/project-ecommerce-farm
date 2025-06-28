import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DiseaseService } from './disease.service';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';

@Controller('disease')
export class DiseaseController {
  constructor(private readonly diseaseService: DiseaseService) {}

  @Post()
  async create(@Body() createDiseaseDto: CreateDiseaseDto) {
    return await this.diseaseService.create(createDiseaseDto);
  }

  @Get()
  async findAll() {
    return await this.diseaseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.diseaseService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDiseaseDto: UpdateDiseaseDto,
  ) {
    return await this.diseaseService.update(id, updateDiseaseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.diseaseService.remove(id);
  }
}
