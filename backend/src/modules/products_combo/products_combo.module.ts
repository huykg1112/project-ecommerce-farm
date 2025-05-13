import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../product/products.module';
import { UserModule } from '../users/user.module';
import { ProductsCombo } from './entities/products_combo.entity';
import { ProductsComboController } from './products_combo.controller';
import { ProductsComboService } from './products_combo.service';

@Module({

  imports: [
    TypeOrmModule.forFeature([ProductsCombo]),
    ConfigModule,
    forwardRef(() => UserModule),
    forwardRef(() => ProductsModule),
  ],

  controllers: [ProductsComboController],
  providers: [ProductsComboService],
  exports: [ProductsComboService],
})
export class ProductsComboModule {}
