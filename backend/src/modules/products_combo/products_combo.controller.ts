import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { RoleGuard } from '../../auth/role.guard';
import { Roles } from '../../auth/roles.decorator';
import { Public } from '../../public.decorator';
import { CreateProductsComboDto } from './dto/create-products-combo.dto';
import { ProductsComboService } from './products_combo.service';

@Controller('products-combo')
@UseGuards(RoleGuard)
export class ProductsComboController {
  constructor(private readonly productsComboService: ProductsComboService) {}

  @Post()
  @Roles('Distributor')
  async create(@Body() createProductsComboDto: CreateProductsComboDto, @Req() req) {
    return this.productsComboService.create(createProductsComboDto, req.user.id);
  }

  @Get()
  @Public()
  async findAll() {
    return this.productsComboService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.productsComboService.findOne(id);
  }

  @Get('distributor/:distributorId')
  @Public()
  async findByDistributor(@Param('distributorId') distributorId: string) {
    return this.productsComboService.findByDistributor(distributorId);
  }

  @Patch(':id/toggle-active')
  @Roles('Distributor')
  async toggleActive(@Param('id') id: string, @Req() req) {
    return this.productsComboService.toggleActive(id, req.user.id);
  }
}
