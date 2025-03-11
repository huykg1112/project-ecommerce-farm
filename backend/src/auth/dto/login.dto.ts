import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Username không được để trống' })
  @IsString({ message: 'Username phải là chuỗi' })
  username: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @IsString({ message: 'Password phải là chuỗi' })
  password: string;
}
