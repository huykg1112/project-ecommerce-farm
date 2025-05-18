import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterStoreDto {

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  phone: string;


  @IsNotEmpty()
  @IsString()
  cccd: string;

  @IsNotEmpty()
  @IsString()
  license: string;

  @IsOptional()
  @IsString()
  imageStore?: string;

  @IsOptional()
  @IsString()
  imageStorePublicId?: string;

  @IsOptional()
  @IsString()
  addressStore?: string;

  @IsOptional()
  @IsString()
  nameStore?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;
} 