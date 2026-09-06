import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HabitService } from '../../services/habit.service';
import { Habit, CATEGORY_LABELS, HabitCategory, HabitFrequency } from '../../models/habit.types';

@Component({
  selector: 'app-habit-form',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/" class="text-sm no-underline hover:underline" style="color: var(--color-brand)">
          &larr; Back to Dashboard
        </a>
        <h1 class="text-2xl font-bold mt-2" style="color: var(--color-text)">
          {{ isEdit() ? 'Edit Habit' : 'Create New Habit' }}
        </h1>
      </div>

      <form
        (ngSubmit)="onSubmit()"
        class="rounded-xl p-6 border space-y-5"
        style="background: var(--color-bg-card); border-color: var(--color-border)"
      >
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--color-text)">Name</label>
          <input
            [(ngModel)]="name"
            name="name"
            required
            maxlength="120"
            placeholder="e.g., Morning jog, Read 20 pages..."
            class="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all"
            style="border-color: var(--color-border); background: var(--color-bg); color: var(--color-text)"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--color-text)">Description (optional)</label>
          <textarea
            [(ngModel)]="description"
            name="description"
            rows="3"
            placeholder="Describe your habit..."
            class="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none transition-all"
            style="border-color: var(--color-border); background: var(--color-bg); color: var(--color-text)"
          ></textarea>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--color-text)">Category</label>
          <select
            [(ngModel)]="category"
            name="category"
            class="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all"
            style="border-color: var(--color-border); background: var(--color-bg); color: var(--color-text)"
          >
            @for (cat of categoryKeys; track cat) {
              <option [value]="cat">{{ CATEGORY_LABELS[cat] }}</option>
            }
          </select>
        </div>

        <!-- Frequency -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--color-text)">Frequency</label>
          <div class="flex gap-3">
            <label
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-all"
              [style.border-color]="frequency() === 'daily' ? 'var(--color-brand)' : 'var(--color-border)'"
              [style.background]="frequency() === 'daily' ? 'var(--color-brand)' + '12' : 'var(--color-bg)'"
              [style.color]="frequency() === 'daily' ? 'var(--color-brand)' : 'var(--color-text)'"
            >
              <input type="radio" name="frequency" value="daily" [(ngModel)]="frequency" class="sr-only" />
              Daily
            </label>
            <label
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-all"
              [style.border-color]="frequency() === 'weekly' ? 'var(--color-brand)' : 'var(--color-border)'"
              [style.background]="frequency() === 'weekly' ? 'var(--color-brand)' + '12' : 'var(--color-bg)'"
              [style.color]="frequency() === 'weekly' ? 'var(--color-brand)' : 'var(--color-text)'"
            >
              <input type="radio" name="frequency" value="weekly" [(ngModel)]="frequency" class="sr-only" />
              Weekly
            </label>
          </div>
        </div>

        <!-- Color -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--color-text)">Color</label>
          <div class="flex gap-2">
            @for (color of presetColors; track color) {
              <button
                type="button"
                class="w-8 h-8 rounded-full border-2 transition-all"
                [style.background]="color"
                [style.border-color]="selectedColor() === color ? 'var(--color-text)' : 'transparent'"
                (click)="selectedColor.set(color)"
              ></button>
            }
          </div>
        </div>

        <!-- Submit -->
        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            [disabled]="submitting() || !name()"
            class="flex-1 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50"
            style="background: var(--color-brand)"
          >
            {{ submitting() ? 'Saving...' : isEdit() ? 'Update Habit' : 'Create Habit' }}
          </button>
          <a
            routerLink="/"
            class="px-5 py-2.5 rounded-lg text-sm font-medium no-underline text-center transition-all"
            style="background: var(--color-bg); color: var(--color-text-secondary); border: 1px solid var(--color-border)"
          >
            Cancel
          </a>
        </div>

        @if (submitError()) {
          <p class="text-sm text-center" style="color: var(--color-danger)">{{ submitError() }}</p>
        }
      </form>
    </div>
  `,
})
export class HabitFormComponent implements OnInit {
  private readonly habitService = inject(HabitService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly name = signal('');
  readonly description = signal('');
  readonly category = signal<HabitCategory>('other');
  readonly frequency = signal<HabitFrequency>('daily');
  readonly selectedColor = signal('#6366f1');
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly CATEGORY_LABELS = CATEGORY_LABELS;
  readonly categoryKeys = Object.keys(CATEGORY_LABELS) as HabitCategory[];
  readonly presetColors = [
    '#6366f1', '#3b82f6', '#22c55e', '#f59e0b',
    '#ec4899', '#8b5cf6', '#10b981', '#ef4444',
  ];

  private editId: number | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = parseInt(id, 10);
      this.habitService.getHabit(this.editId).subscribe({
        next: (habit) => {
          this.name.set(habit.name);
          this.description.set(habit.description || '');
          this.category.set(habit.category as HabitCategory);
          this.frequency.set(habit.frequency as HabitFrequency);
          this.selectedColor.set(habit.color);
        },
      });
    }
  }

  isEdit(): boolean {
    return this.editId !== null;
  }

  onSubmit() {
    if (!this.name().trim()) return;
    this.submitting.set(true);
    this.submitError.set(null);

    const dto = {
      name: this.name().trim(),
      description: this.description().trim() || undefined,
      category: this.category(),
      frequency: this.frequency(),
      color: this.selectedColor(),
    };

    const request = this.editId
      ? this.habitService.updateHabit(this.editId, dto)
      : this.habitService.createHabit(dto);

    request.subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.submitError.set('Failed to save habit. Is the API server running?');
        this.submitting.set(false);
      },
    });
  }
}
