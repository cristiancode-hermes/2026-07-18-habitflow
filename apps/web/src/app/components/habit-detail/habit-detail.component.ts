import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HabitService } from '../../services/habit.service';
import { Habit, CATEGORY_LABELS, HabitCategory } from '../../models/habit.types';
import { HeatmapCalendarComponent } from '../heatmap-calendar/heatmap-calendar.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-habit-detail',
  imports: [RouterLink, HeatmapCalendarComponent, DatePipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/" class="text-sm no-underline hover:underline" style="color: var(--color-brand)">
          &larr; Back to Dashboard
        </a>
      </div>

      @if (loading()) {
        <div class="text-center py-12" style="color: var(--color-text-secondary)">Loading...</div>
      }

      @let h = habit();
      @if (h) {
        <div class="rounded-xl p-6 border mb-6" style="background: var(--color-bg-card); border-color: var(--color-border)">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-2xl font-bold" style="color: var(--color-text)">{{ h.name }}</h1>
              @if (h.description) {
                <p class="mt-1" style="color: var(--color-text-secondary)">{{ h.description }}</p>
              }
              <div class="flex items-center gap-3 mt-2">
                <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                  [style.background]="habitColor() + '18'"
                  [style.color]="habitColor()">
                  {{ getCategoryLabel(h.category) }}
                </span>
                <span class="text-xs" style="color: var(--color-text-secondary)">
                  {{ h.frequency }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <a
                [routerLink]="['/habits', h.id, 'edit']"
                class="px-3 py-1.5 rounded-lg text-xs font-medium no-underline"
                style="background: var(--color-bg); color: var(--color-text-secondary); border: 1px solid var(--color-border)"
              >
                Edit
              </a>
              <button
                (click)="deleteHabit()"
                class="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Quick Check-in -->
          <div class="flex items-center gap-3 mb-6 p-4 rounded-lg"
            [style.background]="todayCheckedIn() ? '#f0fdf4' : '#f8fafc'"
            [style.border]="'1px solid ' + (todayCheckedIn() ? '#bbf7d0' : 'var(--color-border)')">
            <button
              (click)="toggleCheckIn()"
              class="w-12 h-12 rounded-full flex items-center justify-center text-2xl cursor-pointer transition-all hover:scale-110"
              [style.background]="todayCheckedIn() ? 'var(--color-success)' : 'var(--color-bg)'"
              [style.border]="'2px solid ' + (todayCheckedIn() ? 'var(--color-success)' : 'var(--color-border)')"
            >
              {{ todayCheckedIn() ? '\u2705' : '\u2795' }}
            </button>
            <div>
              <p class="text-sm font-medium" style="color: var(--color-text)">
                {{ todayCheckedIn() ? 'Checked in today!' : 'Check in for today' }}
              </p>
              <p class="text-xs" style="color: var(--color-text-secondary)">
                {{ todayCheckedIn() ? 'Great job staying consistent!' : 'Mark this habit as done' }}
              </p>
            </div>
            <div class="ml-auto text-right">
              <p class="text-2xl font-bold" style="color: var(--color-success)">{{ currentStreak }}</p>
              <p class="text-xs" style="color: var(--color-text-secondary)">day streak</p>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-3 mb-6">
            <div class="text-center p-3 rounded-lg" style="background: var(--color-bg)">
              <p class="text-lg font-bold" style="color: var(--color-text)">{{ totalCheckins }}</p>
              <p class="text-xs" style="color: var(--color-text-secondary)">Total</p>
            </div>
            <div class="text-center p-3 rounded-lg" style="background: var(--color-bg)">
              <p class="text-lg font-bold" style="color: var(--color-text)">{{ longestStreak }}</p>
              <p class="text-xs" style="color: var(--color-text-secondary)">Best Streak</p>
            </div>
            <div class="text-center p-3 rounded-lg" style="background: var(--color-bg)">
              <p class="text-lg font-bold" style="color: var(--color-text)">{{ completionRate }}%</p>
              <p class="text-xs" style="color: var(--color-text-secondary)">Rate</p>
            </div>
          </div>

          <!-- Heatmap -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold mb-2" style="color: var(--color-text)">Activity (Last 30 Days)</h3>
            <app-heatmap-calendar
              [dates]="checkinDates()"
              [habitColor]="habitColor()"
              [streak]="currentStreak"
              [completionRate]="completionRate"
            />
          </div>
        </div>

        <!-- Check-in History -->
        <div class="rounded-xl p-6 border" style="background: var(--color-bg-card); border-color: var(--color-border)">
          <h3 class="font-semibold mb-4" style="color: var(--color-text)">Check-in History</h3>
          @let checkins = h.checkins;
          @if (checkins && checkins.length > 0) {
            <div class="space-y-2 max-h-64 overflow-y-auto">
              @for (checkin of checkins.slice().reverse(); track checkin.id) {
                <div class="flex items-center justify-between py-2 px-3 rounded-lg" style="background: var(--color-bg)">
                  <div class="flex items-center gap-2">
                    <span style="color: var(--color-success)">&#10003;</span>
                    <span class="text-sm" style="color: var(--color-text)">{{ checkin.date | date:'mediumDate' }}</span>
                    @if (checkin.note) {
                      <span class="text-xs" style="color: var(--color-text-secondary)">— {{ checkin.note }}</span>
                    }
                  </div>
                  <button
                    (click)="deleteCheckin(checkin.id)"
                    class="text-xs px-2 py-0.5 rounded cursor-pointer hover:underline"
                    style="color: var(--color-danger)"
                  >
                    Remove
                  </button>
                </div>
              }
            </div>
          } @else {
            <p class="text-sm py-4 text-center" style="color: var(--color-text-secondary)">
              No check-ins yet. Start your streak today!
            </p>
          }
        </div>
      }
    </div>
  `,
})
export class HabitDetailComponent implements OnInit {
  private readonly habitService = inject(HabitService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly habit = signal<Habit | null>(null);
  readonly loading = signal(true);
  readonly todayCheckedIn = signal(false);
  readonly checkinDates = signal<string[]>([]);

  currentStreak = 0;
  longestStreak = 0;
  completionRate = 0;
  totalCheckins = 0;

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.loadHabit(id);
  }

  private loadHabit(id: number) {
    this.habitService.getHabit(id).subscribe({
      next: (habit) => {
        this.habit.set(habit);
        this.loading.set(false);
        this.processCheckins(habit);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private processCheckins(habit: Habit) {
    const checkins = habit.checkins || [];
    const dates = checkins.map((c) => c.date).sort();
    this.checkinDates.set(dates);

    const today = new Date().toISOString().split('T')[0];
    this.todayCheckedIn.set(dates.includes(today));

    this.totalCheckins = checkins.length;
    this.currentStreak = this.calculateCurrentStreak(dates, today);
    this.longestStreak = this.calculateLongestStreak(dates);
    this.completionRate = this.calculateRate(dates, today);
  }

  private calculateCurrentStreak(dates: string[], today: string): number {
    if (dates.length === 0) return 0;
    let streak = 0;
    const set = new Set(dates);
    const current = new Date(today);
    while (true) {
      const ds = current.toISOString().split('T')[0];
      if (set.has(ds)) { streak++; current.setDate(current.getDate() - 1); }
      else break;
    }
    return streak;
  }

  private calculateLongestStreak(dates: string[]): number {
    if (dates.length === 0) return 0;
    const sorted = [...new Set(dates)].sort();
    let longest = 1, current = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diff = Math.round(
        (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff === 1) { current++; longest = Math.max(longest, current); }
      else current = 1;
    }
    return longest;
  }

  private calculateRate(dates: string[], today: string): number {
    const set = new Set(dates);
    let count = 0;
    const d = new Date(today);
    for (let i = 0; i < 30; i++) {
      if (set.has(d.toISOString().split('T')[0])) count++;
      d.setDate(d.getDate() - 1);
    }
    return Math.round((count / 30) * 100);
  }

  getCategoryLabel(category: string): string {
    return CATEGORY_LABELS[category as HabitCategory] || category;
  }

  habitColor(): string {
    return this.habit()?.color || '#6366f1';
  }

  toggleCheckIn() {
    const habit = this.habit();
    if (!habit) return;

    if (this.todayCheckedIn()) {
      const today = new Date().toISOString().split('T')[0];
      const checkin = habit.checkins?.find((c) => c.date === today);
      if (checkin) {
        this.habitService.deleteCheckIn(checkin.id).subscribe({
          next: () => this.loadHabit(habit.id),
        });
      }
    } else {
      this.habitService.checkIn(habit.id, {}).subscribe({
        next: () => this.loadHabit(habit.id),
      });
    }
  }

  deleteCheckin(id: number) {
    this.habitService.deleteCheckIn(id).subscribe({
      next: () => this.loadHabit(this.habit()!.id),
    });
  }

  deleteHabit() {
    const habit = this.habit();
    if (!habit) return;
    if (confirm(`Delete "${habit.name}"? This cannot be undone.`)) {
      this.habitService.deleteHabit(habit.id).subscribe({
        next: () => this.router.navigate(['/']),
      });
    }
  }
}
