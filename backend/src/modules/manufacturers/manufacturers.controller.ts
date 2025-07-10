import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '@root/src/public.decorator';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { ManufacturersService } from './manufacturers.service';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(
    private readonly manufacturersService: ManufacturersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createManufacturerDto: CreateManufacturerDto) {
    return this.manufacturersService.create(createManufacturerDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.manufacturersService.findAll();
  }

  @Get('active')
  @Public()
  findActiveManufacturers() {
    return this.manufacturersService.findActiveManufacturers();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.manufacturersService.findOne(id);
  }

  @Get(':id/with-product-count')
  @Public()
  getManufacturerWithProductCount(@Param('id') id: string) {
    return this.manufacturersService.getManufacturerWithProductCount(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
  ) {
    return this.manufacturersService.update(id, updateManufacturerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.manufacturersService.remove(id);
  }

  @Patch(':id/soft-delete')
  softDelete(@Param('id') id: string) {
    return this.manufacturersService.softDelete(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.manufacturersService.restore(id);
  }

  @Post(':id/logo')
  @UseInterceptors(FileInterceptor('logo'))
  async uploadManufacturerLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const result = await this.cloudinaryService.uploadImage(file);
    return this.manufacturersService.updateManufacturerLogo(
      id,
      result.url,
      result.public_id,
    );
  }
}
