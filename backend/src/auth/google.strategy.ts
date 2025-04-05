import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('Callback_URL') || '',
      scope: ['email', 'profile'],
      passReqToCallback: true, // Giữ nguyên nếu bạn cần req
    });
  }

  async validate(
    req: any, // Thêm req vào đây
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails, photos } = profile;
      const user = {
        email: emails[0]?.value,
        firstName: name?.givenName,
        lastName: name?.familyName,
        picture: photos[0]?.value,
        accessToken,
        refreshToken,
      };
      console.log('User profile:', user); // In ra thông tin người dùng để kiểm tra

      // Trả về thông tin người dùng
      done(null, user);
    } catch (error) {
      // Xử lý lỗi
      done(error, false);
    }
  }
}
