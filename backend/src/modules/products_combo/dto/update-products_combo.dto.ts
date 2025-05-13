import { PartialType } from '@nestjs/mapped-types';
import { CreateProductsComboDto } from './create-products_combo.dto';

export class UpdateProductsComboDto extends PartialType(CreateProductsComboDto) {}
