import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {

    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || '',

      scope: ['email', 'profile'], // Quyền truy cập email và thông tin cơ bản
      // passReqToCallback: true, // Required for StrategyOptionsWithRequest
      state: true, // Required for StrategyOptionsWithRequest
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,

  ): Promise<any> {
    const { id, emails, displayName } = profile;
    const user = {
      googleId: id, // ID từ Google
      email: emails[0].value, // Email người dùng
      fullName: displayName, // Tên đầy đủ
      accessToken, // Access token từ Google (không phải JWT của bạn)
      refreshToken, // Refresh token từ Google
    };
    return user; // Trả về thông tin để AuthService xử lý
  }
}
