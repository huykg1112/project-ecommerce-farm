import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsDate()
  accessTokenExpiresAt: Date;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsDate()
  refreshTokenExpiresAt: Date;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
