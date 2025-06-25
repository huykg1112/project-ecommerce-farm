import { Module } from '@nestjs/common';
import { InvenstoryService } from './invenstory.service';
import { InvenstoryController } from './invenstory.controller';

@Module({
  controllers: [InvenstoryController],
  providers: [InvenstoryService],
})
export class InvenstoryModule {}
