import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../modules/token/token.module';
import { User } from '../modules/user/entities/user.entity';
import { UserModule } from '../modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    UserModule,
    TokenModule, // Cung cấp TokenService
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      global: true, // Đặt module này là global
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret',
        signOptions: { expiresIn: '5h' },
      }),
    }),
    ConfigModule,
  ],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
