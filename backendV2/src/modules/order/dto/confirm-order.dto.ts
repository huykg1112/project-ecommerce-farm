import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ConfirmOrderDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;
}

export class CancelOrderDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;
}