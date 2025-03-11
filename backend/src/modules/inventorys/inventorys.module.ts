import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventorysController } from './inventorys.controller';
import { InventorysService } from './inventorys.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory]), //
  ],
  controllers: [InventorysController],
  providers: [InventorysService],
})
export class InventorysModule {}
