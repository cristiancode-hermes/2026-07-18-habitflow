import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit, HabitFrequency } from '../habits/entities/habit.entity';
import { CheckIn } from '../checkins/entities/checkin.entity';

export interface HabitStats {
  id: number;
  name: string;
  category: string;
  color: string;
  icon: string;
  frequency: HabitFrequency;
  totalCheckins: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  lastCheckinDate: string | null;
}

export interface DashboardResponse {
  totalHabits: number;
  activeHabits: number;
  totalCheckins: number;
  todayCheckins: number;
  habits: HabitStats[];
  bestStreak: { name: string; streak: number } | null;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
    @InjectRepository(CheckIn)
    private readonly checkinsRepository: Repository<CheckIn>,
  ) {}

  async getDashboard(): Promise<DashboardResponse> {
    const habits = await this.habitsRepository.find({
      where: { isActive: true },
      relations: ['checkins'] as any,
    });

    const today = new Date().toISOString().split('T')[0];
    const todayCheckins = await this.checkinsRepository.count({
      where: { date: today },
    });

    const totalCheckins = await this.checkinsRepository.count();

    const habitsWithStats: HabitStats[] = habits.map((habit) => {
      const checkins = habit.checkins || [];
      const sortedDates = checkins
        .map((c) => c.date)
        .sort((a, b) => a.localeCompare(b));

      const currentStreak = this.calculateCurrentStreak(sortedDates, today);
      const longestStreak = this.calculateLongestStreak(sortedDates);
      const completionRate = this.calculateCompletionRate(
        sortedDates,
        habit.frequency,
        today,
      );

      return {
        id: habit.id,
        name: habit.name,
        category: habit.category,
        color: habit.color,
        icon: habit.icon,
        frequency: habit.frequency,
        totalCheckins: checkins.length,
        currentStreak,
        longestStreak,
        completionRate,
        lastCheckinDate: sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null,
      };
    });

    let bestStreak: { name: string; streak: number } | null = null;
    for (const h of habitsWithStats) {
      if (!bestStreak || h.longestStreak > bestStreak.streak) {
        bestStreak = { name: h.name, streak: h.longestStreak };
      }
    }

    return {
      totalHabits: habits.length,
      activeHabits: habits.length,
      totalCheckins,
      todayCheckins,
      habits: habitsWithStats,
      bestStreak,
    };
  }

  private calculateCurrentStreak(dates: string[], today: string): number {
    if (dates.length === 0) return 0;

    let streak = 0;
    const checkinSet = new Set(dates);
    const current = new Date(today);

    while (true) {
      const dateStr = current.toISOString().split('T')[0];
      if (checkinSet.has(dateStr)) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  private calculateLongestStreak(dates: string[]): number {
    if (dates.length === 0) return 0;

    const sorted = [...new Set(dates)].sort();
    let longest = 1;
    let current = 1;

    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diffDays = Math.round(
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays === 1) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }

    return longest;
  }

  private calculateCompletionRate(
    dates: string[],
    frequency: HabitFrequency,
    today: string,
  ): number {
    const checkinSet = new Set(dates);

    if (frequency === HabitFrequency.DAILY) {
      const last30Days: string[] = [];
      const d = new Date(today);
      for (let i = 0; i < 30; i++) {
        last30Days.push(d.toISOString().split('T')[0]);
        d.setDate(d.getDate() - 1);
      }
      const completed = last30Days.filter((date) => checkinSet.has(date)).length;
      return Math.round((completed / 30) * 100);
    }

    const last12Weeks: string[] = [];
    const d = new Date(today);
    for (let i = 0; i < 12; i++) {
      const monday = new Date(d);
      const dayOfWeek = monday.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      monday.setDate(monday.getDate() + diff);
      last12Weeks.push(monday.toISOString().split('T')[0]);
      d.setDate(d.getDate() - 7);
    }
    const completed = last12Weeks.filter((weekStart) =>
      dates.some(
        (date) => date >= weekStart && date < this.addDays(weekStart, 7),
      ),
    ).length;
    return Math.round((completed / 12) * 100);
  }

  private addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }
}
