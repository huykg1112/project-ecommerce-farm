import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // or SequelizeModule
import { BatchProductController } from './batch-product.controller';
import { BatchProductService } from './batch-product.service';
import { BatchProduct } from './entities/batch-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BatchProduct])], // <-- This is critical!
  providers: [BatchProductService],
  controllers: [BatchProductController],
  exports: [TypeOrmModule], // Optional, if you want to use the repository elsewhere
})
export class BatchProductModule {}
