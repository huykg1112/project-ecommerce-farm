import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDiseaseDto } from './dto/create-product_disease.dto';
import { UpdateProductDiseaseDto } from './dto/update-product_disease.dto';
import { ProductDiseaseService } from './product_disease.service';

@Controller('product-disease')
export class ProductDiseaseController {
  constructor(private readonly productDiseaseService: ProductDiseaseService) {}

  @Post()
  create(@Body() createProductDiseaseDto: CreateProductDiseaseDto) {
    return this.productDiseaseService.create(createProductDiseaseDto);
  }

  @Get()
  findAll() {
    return this.productDiseaseService.findAll();
  }

  @Get('by-product/:product_id')
  findByProduct(@Param('product_id') product_id: string) {
    return this.productDiseaseService.findByProduct(product_id);
  }

  @Get('by-disease/:disease_id')
  findByDisease(@Param('disease_id') disease_id: string) {
    return this.productDiseaseService.findByDisease(disease_id);
  }

  @Get(':product_id/:disease_id')
  findOne(
    @Param('product_id') product_id: string,
    @Param('disease_id') disease_id: string,
  ) {
    return this.productDiseaseService.findOne(product_id, disease_id);
  }

  @Patch(':product_id/:disease_id')
  update(
    @Param('product_id') product_id: string,
    @Param('disease_id') disease_id: string,
    @Body() updateProductDiseaseDto: UpdateProductDiseaseDto,
  ) {
    return this.productDiseaseService.update(
      product_id,
      disease_id,
      updateProductDiseaseDto,
    );
  }

  @Delete(':product_id/:disease_id')
  remove(
    @Param('product_id') product_id: string,
    @Param('disease_id') disease_id: string,
  ) {
    return this.productDiseaseService.remove(product_id, disease_id);
  }

  @Get('primary/by-product/:product_id')
  findPrimaryByProduct(@Param('product_id') product_id: string) {
    return this.productDiseaseService.findPrimaryByProduct(product_id);
  }

  @Get('support/by-product/:product_id')
  findSupportByProduct(@Param('product_id') product_id: string) {
    return this.productDiseaseService.findSupportByProduct(product_id);
  }

  @Get('primary/by-disease/:disease_id')
  findPrimaryByDisease(@Param('disease_id') disease_id: string) {
    return this.productDiseaseService.findPrimaryByDisease(disease_id);
  }

  @Get('support/by-disease/:disease_id')
  findSupportByDisease(@Param('disease_id') disease_id: string) {
    return this.productDiseaseService.findSupportByDisease(disease_id);
  }

  @Get('by-product/:product_id/filter')
  findByProductAndIsPrimary(
    @Param('product_id') product_id: string,
    @Query('is_primary') is_primary: string,
  ) {
    return this.productDiseaseService.findByProductAndIsPrimary(
      product_id,
      is_primary === 'true',
    );
  }
}
