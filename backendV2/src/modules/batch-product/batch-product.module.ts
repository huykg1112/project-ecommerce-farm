import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchProductController } from './batch-product.controller';
import { BatchProductService } from './batch-product.service';
import { BatchProduct } from './entities/batch-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BatchProduct])],
  providers: [BatchProductService],
  controllers: [BatchProductController],
  exports: [BatchProductService], // Export service instead of TypeOrmModule
})
export class BatchProductModule {}
