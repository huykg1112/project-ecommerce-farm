import { Module } from '@nestjs/common';
import { BatchController } from './batch-product.controller';
import { BatchService } from './batch-product.service';

@Module({
  controllers: [BatchController],
  providers: [BatchService],
})
export class BatchModule {}
