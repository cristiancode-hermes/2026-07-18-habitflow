import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Habit } from '../habits/entities/habit.entity';
import { CheckIn } from '../checkins/entities/checkin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, CheckIn])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
