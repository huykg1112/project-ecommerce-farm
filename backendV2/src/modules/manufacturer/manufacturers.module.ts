import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';
import { Manufacturer } from './entities/manufacturer.entity';
import { ManufacturersController } from './manufacturers.controller';
import { ManufacturersService } from './manufacturers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Manufacturer]),
    forwardRef(() => CloudinaryModule),
  ],
  controllers: [ManufacturersController],
  providers: [ManufacturersService],
  exports: [ManufacturersService], // Export để các module khác có thể sử dụng
})
export class ManufacturersModule {}
