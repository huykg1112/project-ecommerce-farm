import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from '../address/address.module';
import { Address } from '../address/entities/address.entity';
import { InvenstoryModule } from '../invenstory/invenstory.module';
import { RoleModule } from '../role/role.module';
import { TokenModule } from '../token/token.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CloudinaryModule } from '@root/src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address]),
    ConfigModule,
    forwardRef(() => TokenModule),
    forwardRef(() => RoleModule),
    forwardRef(() => InvenstoryModule),
    forwardRef(() => CloudinaryModule),
    AddressModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
