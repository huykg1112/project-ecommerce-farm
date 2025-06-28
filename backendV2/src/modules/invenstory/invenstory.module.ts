import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Invenstory } from './entities/invenstory.entity';
import { InvenstoryController } from './invenstory.controller';
import { InvenstoryService } from './invenstory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invenstory, User])],
  controllers: [InvenstoryController],
  providers: [InvenstoryService],
  exports: [InvenstoryService],
})
export class InvenstoryModule {}
