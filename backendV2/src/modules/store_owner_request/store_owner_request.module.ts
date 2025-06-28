import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invenstory } from '../invenstory/entities/invenstory.entity';
import { InvenstoryModule } from '../invenstory/invenstory.module';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { StoreOwnerRequest } from './entities/store_owner_request.entity';
import { StoreOwnerRequestController } from './store_owner_request.controller';
import { StoreOwnerRequestService } from './store_owner_request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreOwnerRequest, User, Invenstory]),
    forwardRef(() => UserModule),
    forwardRef(() => InvenstoryModule),
  ],
  controllers: [StoreOwnerRequestController],
  providers: [StoreOwnerRequestService],
  exports: [StoreOwnerRequestService],
})
export class StoreOwnerRequestModule {}
