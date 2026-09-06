import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { Habit } from './entities/habit.entity';

@ApiTags('habits')
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new habit' })
  @ApiResponse({ status: 201, description: 'Habit created', type: Habit })
  create(@Body() dto: CreateHabitDto): Promise<Habit> {
    return this.habitsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all habits' })
  @ApiResponse({ status: 200, description: 'All habits', type: [Habit] })
  findAll(): Promise<Habit[]> {
    return this.habitsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a habit with check-ins' })
  @ApiResponse({ status: 200, description: 'Habit with relations', type: Habit })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Habit> {
    return this.habitsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a habit' })
  @ApiResponse({ status: 200, description: 'Habit updated', type: Habit })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHabitDto,
  ): Promise<Habit> {
    return this.habitsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a habit' })
  @ApiResponse({ status: 200, description: 'Habit deleted' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.habitsService.remove(id);
  }
}
