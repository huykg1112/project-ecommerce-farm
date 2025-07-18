import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Public } from '@root/src/public.decorator';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { ProductTypeService } from './product-type.service';

@Controller('product-type')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Post()
  create(@Body() createProductTypeDto: CreateProductTypeDto) {
    return this.productTypeService.create(createProductTypeDto);
  }

  // tự động tạo loại sản phẩm gồm các loại: dụng dịch (ml), gói (g), bột (kg), kilogam(kg), cái (cái), hộp (hộp)
  @Post('auto-create')
  autoCreate() {
    const productTypes = [
      { type_name: 'Dụng dịch', description: 'ml' },
      { type_name: 'Gói', description: 'g' },
      { type_name: 'Bột', description: 'kg' },
      { type_name: 'Kilogam', description: 'kg' },
      { type_name: 'Cái', description: 'cái' },
      { type_name: 'Hộp', description: 'hộp' },
    ];
    return this.productTypeService.createMany(productTypes);
  }

  @Public()
  @Get()
  findAll() {
    return this.productTypeService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productTypeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductTypeDto: UpdateProductTypeDto,
  ) {
    return this.productTypeService.update(id, updateProductTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productTypeService.remove(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.productTypeService.restore(id);
  }
}
