import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HabitService } from '../../services/habit.service';
import { DashboardResponse, CATEGORY_LABELS, HabitCategory } from '../../models/habit.types';
import { HeatmapCalendarComponent } from '../heatmap-calendar/heatmap-calendar.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, HeatmapCalendarComponent],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold" style="color: var(--color-text)">Dashboard</h1>
        <p class="mt-1" style="color: var(--color-text-secondary)">
          Track your habits and streaks
        </p>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="text-center py-12" style="color: var(--color-text-secondary)">
          Loading your habits...
        </div>
      }

      <!-- Error -->
      @if (error()) {
        <div class="rounded-xl p-6 text-center" style="background: #fef2f2; color: #991b1b">
          <p>{{ error() }}</p>
          <p class="text-sm mt-2">Make sure the API server is running on http://localhost:3000</p>
        </div>
      }

      @let data = dashboard();
      @if (data && !loading()) {
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="rounded-xl p-5 border" style="background: var(--color-bg-card); border-color: var(--color-border)">
            <p class="text-sm font-medium" style="color: var(--color-text-secondary)">Active Habits</p>
            <p class="text-3xl font-bold mt-1" style="color: var(--color-text)">{{ data.totalHabits }}</p>
          </div>
          <div class="rounded-xl p-5 border" style="background: var(--color-bg-card); border-color: var(--color-border)">
            <p class="text-sm font-medium" style="color: var(--color-text-secondary)">Today's Check-ins</p>
            <p class="text-3xl font-bold mt-1" style="color: var(--color-success)">{{ data.todayCheckins }}</p>
          </div>
          <div class="rounded-xl p-5 border" style="background: var(--color-bg-card); border-color: var(--color-border)">
            <p class="text-sm font-medium" style="color: var(--color-text-secondary)">Total Check-ins</p>
            <p class="text-3xl font-bold mt-1" style="color: var(--color-text)">{{ data.totalCheckins }}</p>
          </div>
          <div class="rounded-xl p-5 border" style="background: var(--color-bg-card); border-color: var(--color-border)">
            <p class="text-sm font-medium" style="color: var(--color-text-secondary)">Best Streak</p>
            <p class="text-3xl font-bold mt-1" style="color: var(--color-brand)">
              {{ (data.bestStreak?.streak) ?? 0 }} days
            </p>
            @if (data.bestStreak) {
              <p class="text-xs mt-0.5" style="color: var(--color-text-secondary)">
                {{ data.bestStreak.name }}
              </p>
            }
          </div>
        </div>

        <!-- Best Streak Highlight -->
        @if (data.bestStreak && data.bestStreak.streak > 0) {
          <div class="rounded-xl p-4 mb-8 flex items-center gap-3 text-sm" style="background: #fefce8; color: #92400e">
            <span class="text-lg">&#128293;</span>
            <span>
              <strong>{{ data.bestStreak.name }}</strong> has the longest streak at
              <strong>{{ data.bestStreak.streak }} days</strong>!
            </span>
          </div>
        }

        <!-- Habits List -->
        <h2 class="text-xl font-semibold mb-4" style="color: var(--color-text)">Your Habits</h2>

        @if (data.habits.length === 0) {
          <div class="text-center py-16 rounded-xl border border-dashed" style="border-color: var(--color-border)">
            <p class="text-lg mb-2" style="color: var(--color-text-secondary)">No habits yet</p>
            <p class="text-sm mb-4" style="color: var(--color-text-secondary)">Create your first habit to start tracking</p>
            <a
              routerLink="/habits/new"
              class="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-white no-underline"
              style="background: var(--color-brand)"
            >
              + Create Habit
            </a>
          </div>
        }

        <div class="space-y-4">
          @for (habit of data.habits; track habit.id) {
            <a
              [routerLink]="['/habits', habit.id]"
              class="block rounded-xl p-5 border no-underline transition-all hover:shadow-md"
              style="background: var(--color-bg-card); border-color: var(--color-border)"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    [style.background]="habit.color + '18'"
                  >
                    <span>{{ getCategoryEmoji(habit.category) }}</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-base" style="color: var(--color-text)">{{ habit.name }}</h3>
                    <p class="text-xs" style="color: var(--color-text-secondary)">
                      {{ getCategoryLabel(habit.category) }}
                      · {{ habit.frequency }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold" [style.color]="habit.currentStreak > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)'">
                    {{ habit.currentStreak }}
                  </p>
                  <p class="text-xs" style="color: var(--color-text-secondary)">day streak</p>
                </div>
              </div>

              <app-heatmap-calendar
                [dates]="[]"
                [habitColor]="habit.color"
                [streak]="habit.currentStreak"
                [completionRate]="habit.completionRate"
              />
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly habitService = inject(HabitService);

  readonly dashboard = signal<DashboardResponse | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this.habitService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not connect to the API server.');
        this.loading.set(false);
      },
    });
  }

  getCategoryLabel(category: string): string {
    return CATEGORY_LABELS[category as HabitCategory] || category;
  }

  getCategoryEmoji(category: string): string {
    const emojis: Record<string, string> = {
      health: '\u{1F4AA}',
      learning: '\u{1F4DA}',
      productivity: '\u{1F680}',
      creativity: '\u{1F3A8}',
      finance: '\u{1F4B0}',
      social: '\u{1F91D}',
      mindfulness: '\u{1F9D8}',
      other: '\u{2B50}',
    };
    return emojis[category] || '\u{2B50}';
  }
}
