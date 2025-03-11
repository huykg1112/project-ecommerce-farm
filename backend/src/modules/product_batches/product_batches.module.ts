import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBatch } from './entities/product_batch.entity';
import { ProductBatchesController } from './product_batches.controller';
import { ProductBatchesService } from './product_batches.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductBatch]), //
  ],
  controllers: [ProductBatchesController],
  providers: [ProductBatchesService],
})
export class ProductBatchesModule {}
