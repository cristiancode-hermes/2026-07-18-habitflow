# HabitFlow — Frontend Guide

## Stack

- **Angular 22** — standalone components, signal-based reactivity, zoneless
- **Tailwind CSS v4** — utility-first CSS with custom theme via `@theme`
- **Angular Router** — lazy-loaded routes for all views
- **Angular HttpClient** — fetch API with JSON requests

## Component Tree

```
App
├── NavbarComponent        — Top navigation bar with logo + "New Habit" button
├── Router Outlet
│   ├── DashboardComponent  — Main page: summary cards + habit list with heatmaps
│   ├── HabitFormComponent  — Create/Edit habit form
│   └── HabitDetailComponent — Habit view: check-in toggle + stats + history
│       └── HeatmapCalendarComponent — 30-day activity grid
```

## Routes

| Path              | Component           | Description              |
|-------------------|---------------------|--------------------------|
| `/`               | DashboardComponent  | Dashboard overview       |
| `/habits/new`     | HabitFormComponent  | Create new habit         |
| `/habits/:id`     | HabitDetailComponent| View habit + check-in    |
| `/habits/:id/edit`| HabitFormComponent  | Edit habit               |

## State Management

All state is managed via **Angular signals** — no external state library needed.

### Pattern
```typescript
readonly habits = signal<Habit[]>([]);
readonly loading = signal<boolean>(true);
readonly error = signal<string | null>(null);
```

### Why signals over RxJS Observables?
- Simpler mental model (no subscriptions to manage)
- Automatic change detection (no zone.js needed)
- Better tree-shaking and bundle size

## Service Layer

`HabitService` (in `services/habit.service.ts`) wraps all API calls:

```typescript
// Usage in any component:
private readonly habitService = inject(HabitService);

ngOnInit() {
  this.habitService.getDashboard().subscribe({
    next: (data) => this.dashboard.set(data),
    error: (err) => this.error.set('Connection failed'),
  });
}
```

HTTP calls return RxJS `Observable` — use `subscribe()` in components. For real-time features, consider switching to signals with `toSignal()` or `httpResource()`.

## Styling

### Tailwind v4 Theme
Defined in `src/styles.css`:

```css
@theme {
  --color-brand: #6366f1;
  --color-brand-hover: #4f46e5;
  --color-bg: #f8fafc;
  --color-text: #0f172a;
  --color-success: #22c55e;
  --font-heading: 'DM Sans', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
}
```

### Using Custom Properties
Since Angular's build process doesn't process Tailwind v4 `@theme` directives during `ng build`, utility classes like `bg-brand` may not work until the CSS is pre-compiled. Fall back to inline styles with CSS custom properties:

```html
<div [style.background]="'var(--color-bg-card)'"
     [style.border-color]="'var(--color-border)'">
```

This works in all Angular versions without PostCSS processing.

## Fonts

- **Inter** (body text) — loaded from Google Fonts in `index.html`
- **DM Sans** (headings) — loaded from Google Fonts in `index.html`

## Development

```bash
# Frontend dev server
cd apps/web && npm start
# → http://localhost:4200

# API dev server
cd apps/api && npm run start:dev
# → http://localhost:3000/api

# Build
cd apps/api && npm run build
cd apps/web && ./node_modules/.bin/ng build
```

## Tailwind v4 Build Note

The Angular 22 build (`@angular/build:application`) does **not** process Tailwind v4 `@theme` directives. For production:
1. Pre-compile CSS: `node scripts/build-css.js src/styles.css`
2. Then build: `./node_modules/.bin/ng build`
3. This is handled by the deploy pipeline automatically.
