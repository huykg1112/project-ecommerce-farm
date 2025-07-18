import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType } from '../product-type/entities/product-type.entity';
import { Product } from '../product/entities/product.entity';
import { BatchProductController } from './batch-product.controller';
import { BatchProductService } from './batch-product.service';
import { BatchProduct } from './entities/batch-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BatchProduct, ProductType, Product]),

    // forwardRef(() => UserModule),
  ],
  providers: [BatchProductService],
  controllers: [BatchProductController],
  exports: [BatchProductService], // Export service instead of TypeOrmModule
})
export class BatchProductModule {}
