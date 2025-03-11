import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../roles/roles.module';
import { TokensModule } from '../tokens/tokens.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    forwardRef(() => TokensModule), // Ensure TokensModule is imported
    forwardRef(() => RolesModule), // Ensure RolesModule is imported
  ],
  providers: [UserService], // Remove TokensService from providers
  controllers: [UserController],
  exports: [UserService], // Remove TokensService from exports
})
export class UserModule {}
