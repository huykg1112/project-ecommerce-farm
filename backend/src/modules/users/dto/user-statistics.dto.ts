import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum TimeRangeType {
      ALL = 'all',
      YEAR = 'year',
      MONTH = 'month',
      DATE_RANGE = 'date_range',
}

export enum VerificationStatus {
      ALL = 'all',
      VERIFIED = 'verified',
      UNVERIFIED = 'unverified',
}

export class UserStatisticsDto {
      @IsOptional()
      @IsString()
      roleId?: string;

      @IsOptional()
      @IsEnum(VerificationStatus)
      verificationStatus?: VerificationStatus = VerificationStatus.ALL;

      @IsOptional()
      @IsEnum(TimeRangeType)
      timeRangeType?: TimeRangeType = TimeRangeType.ALL;

      @IsOptional()
      @IsDateString()
      startDate?: string;

      @IsOptional()
      @IsDateString()
      endDate?: string;

      @IsOptional()
      @IsString()
      year?: string;

      @IsOptional()
      @IsString()
      month?: string;
} 