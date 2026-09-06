import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <nav class="border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity">
          <span class="text-xl" aria-hidden="true">&#9733;</span>
          <span class="font-bold text-lg" style="color: var(--color-text)">HabitFlow</span>
        </a>
        <a
          routerLink="/habits/new"
          class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white no-underline transition-all hover:brightness-110"
          style="background: var(--color-brand)"
        >
          <span>+</span>
          <span>New Habit</span>
        </a>
      </div>
    </nav>
  `,
})
export class NavbarComponent {}
