import { Module } from '@nestjs/common';
import { DiscountTypeService } from './discount-type.service';
import { DiscountTypeController } from './discount-type.controller';

@Module({
  controllers: [DiscountTypeController],
  providers: [DiscountTypeService],
})
export class DiscountTypeModule {}
