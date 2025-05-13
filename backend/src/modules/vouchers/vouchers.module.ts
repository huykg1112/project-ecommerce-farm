import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { Voucher } from './entities/voucher.entity';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher]),
    ConfigModule,
    forwardRef(() => UserModule),
  ],
  controllers: [VouchersController],
  providers: [VouchersService],
})
export class VouchersModule {}
