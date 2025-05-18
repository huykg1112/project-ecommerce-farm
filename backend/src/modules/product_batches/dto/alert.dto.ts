import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class AlertThresholdDto {
  @IsNumber()
  @IsOptional()
  expiryDaysThreshold?: number = 30;

  @IsNumber()
  @IsOptional()
  stockThreshold?: number = 10;

  @IsUUID()
  @IsOptional()
  distributorId?: string;
}

export class ProductAlertDto {
  id: string;
  name: string;
  batchCode: string;
  quantity: number;
  expiryDate: Date;
  daysUntilExpiry: number;
  alertType: 'EXPIRY' | 'LOW_STOCK';
  distributorId: string;
  distributorName: string;
} 