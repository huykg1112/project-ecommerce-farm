import { TokensModule } from '@modules/tokens/tokens.module'; // Đã import TokenModule
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailsModule } from '../modules/mails/mails.module';
import { User } from '../modules/users/entities/user.entity';
import { UserModule } from '../modules/users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    UserModule,
    TokensModule, // Cung cấp TokenService
    MailsModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret',
        signOptions: { expiresIn: '1h' },
      }),
    }),
    ConfigModule,
  ],
  providers: [AuthService, JwtAuthGuard, GoogleStrategy], // Cung cấp JwtAuthGuard
  controllers: [AuthController],
  exports: [JwtAuthGuard], // Export JwtAuthGuard để UserModule sử dụng
})
export class AuthModule {}
