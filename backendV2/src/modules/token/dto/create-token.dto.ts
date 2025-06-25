import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsDate()
  access_token_expires_at: Date;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @IsDate()
  refresh_token_expires_at: Date;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
