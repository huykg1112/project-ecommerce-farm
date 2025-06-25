import { Module } from '@nestjs/common';
import { StoreOwnerRequestService } from './store_owner_request.service';
import { StoreOwnerRequestController } from './store_owner_request.controller';

@Module({
  controllers: [StoreOwnerRequestController],
  providers: [StoreOwnerRequestService],
})
export class StoreOwnerRequestModule {}
