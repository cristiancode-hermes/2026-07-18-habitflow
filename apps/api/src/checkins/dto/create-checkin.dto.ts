import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCheckInDto {
  @ApiProperty({ description: 'Habit ID', example: 1 })
  habitId: number;

  @ApiPropertyOptional({ description: 'Date (YYYY-MM-DD)', example: '2026-07-18' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ description: 'Optional note', example: 'Felt great today!' })
  @IsString()
  @IsOptional()
  note?: string;
}
