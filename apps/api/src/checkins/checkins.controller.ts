import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CheckinsService } from './checkins.service';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import { CheckIn } from './entities/checkin.entity';

@ApiTags('checkins')
@Controller()
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Post('habits/:habitId/checkin')
  @ApiOperation({ summary: 'Check in for a habit' })
  @ApiResponse({ status: 201, description: 'Check-in created', type: CheckIn })
  checkIn(
    @Param('habitId', ParseIntPipe) habitId: number,
    @Body() dto: CreateCheckInDto,
  ): Promise<CheckIn> {
    return this.checkinsService.create({ ...dto, habitId });
  }

  @Get('habits/:habitId/checkins')
  @ApiOperation({ summary: 'Get all check-ins for a habit' })
  @ApiResponse({ status: 200, description: 'Check-ins', type: [CheckIn] })
  findByHabit(@Param('habitId', ParseIntPipe) habitId: number): Promise<CheckIn[]> {
    return this.checkinsService.findByHabit(habitId);
  }

  @Delete('checkins/:id')
  @ApiOperation({ summary: 'Delete a check-in by ID' })
  @ApiResponse({ status: 200, description: 'Check-in deleted' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.checkinsService.remove(id);
  }

  @Delete('habits/:habitId/checkin')
  @ApiOperation({ summary: 'Delete a check-in by habit ID and date' })
  @ApiQuery({ name: 'date', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Check-in deleted' })
  removeByDate(
    @Param('habitId', ParseIntPipe) habitId: number,
    @Query('date') date: string,
  ): Promise<void> {
    return this.checkinsService.removeByHabitAndDate(habitId, date);
  }
}
