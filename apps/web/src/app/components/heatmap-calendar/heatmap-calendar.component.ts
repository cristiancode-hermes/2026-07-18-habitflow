import { Component, input, computed } from '@angular/core';

type CheckinMap = Record<string, boolean>;

@Component({
  selector: 'app-heatmap-calendar',
  template: `
    <div class="flex flex-col gap-1">
      <div class="grid grid-cols-7 gap-1">
        @for (day of calendarDays(); track day.date) {
          <div
            class="w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-125"
            [style.background]="day.filled ? habitColor() : 'var(--color-border)'"
            [style.opacity]="day.filled ? '1' : '0.3'"
            [title]="day.date + (day.filled ? ' ✓' : '')"
          >
          </div>
        }
      </div>
      <div class="flex items-center gap-2 text-xs mt-1" style="color: var(--color-text-secondary)">
        <span>30-day streak: <strong style="color: var(--color-text)">{{ streak() }}</strong></span>
        <span>·</span>
        <span>{{ completionRate() }}% completion</span>
      </div>
    </div>
  `,
})
export class HeatmapCalendarComponent {
  readonly dates = input<string[]>([]);
  readonly habitColor = input<string>('#6366f1');
  readonly streak = input<number>(0);
  readonly completionRate = input<number>(0);

  readonly calendarDays = computed(() => {
    const checkinSet = new Set(this.dates());
    const days: { date: string; filled: boolean }[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({ date: dateStr, filled: checkinSet.has(dateStr) });
    }
    return days;
  });
}
