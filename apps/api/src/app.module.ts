import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitsModule } from './habits/habits.module';
import { CheckinsModule } from './checkins/checkins.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { Habit } from './habits/entities/habit.entity';
import { CheckIn } from './checkins/entities/checkin.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/habitflow.db',
      entities: [Habit, CheckIn],
      synchronize: true,
    }),
    HabitsModule,
    CheckinsModule,
    DashboardModule,
  ],
})
export class AppModule {}
