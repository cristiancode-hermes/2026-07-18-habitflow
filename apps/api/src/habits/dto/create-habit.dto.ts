import { IsString, IsOptional, IsEnum, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HabitCategory, HabitFrequency } from '../entities/habit.entity';

export class CreateHabitDto {
  @ApiProperty({ description: 'Habit name', example: 'Morning jog' })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ description: 'Description', example: 'Run for 20 minutes every morning' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: HabitCategory, default: HabitCategory.OTHER })
  @IsEnum(HabitCategory)
  @IsOptional()
  category?: HabitCategory;

  @ApiPropertyOptional({ enum: HabitFrequency, default: HabitFrequency.DAILY })
  @IsEnum(HabitFrequency)
  @IsOptional()
  frequency?: HabitFrequency;

  @ApiPropertyOptional({ default: '#6366f1' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ default: 'star' })
  @IsString()
  @IsOptional()
  icon?: string;
}
