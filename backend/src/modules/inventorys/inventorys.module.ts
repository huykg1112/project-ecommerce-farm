import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '@root/src/cloudinary/cloudinary.module';
import { Inventory } from './entities/inventory.entity';
import { InventorysController } from './inventorys.controller';
import { InventorysService } from './inventorys.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory]),
    forwardRef(() => CloudinaryModule),
],
  controllers: [InventorysController],
  providers: [InventorysService],
  exports: [InventorysService],
})
export class InventorysModule {}
