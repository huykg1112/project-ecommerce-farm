import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchProductModule } from '../batch-product/batch-product.module';
import { BatchProduct } from '../batch-product/entities/batch-product.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Promotion } from './entities/promotion.entity';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promotion, BatchProduct, User]),
    forwardRef(() => BatchProductModule),
    forwardRef(() => UserModule),
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}
