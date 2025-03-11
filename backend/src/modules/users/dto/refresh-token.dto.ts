import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'Refresh token không được để trống' })
  @IsString({ message: 'Refresh token phải là chuỗi' })
  refreshToken: string;
}
