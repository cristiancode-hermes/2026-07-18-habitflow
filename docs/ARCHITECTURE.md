# HabitFlow — Architecture

## Overview

HabitFlow is a full-stack habit tracking application built with Angular 22 (frontend) and NestJS (backend). It allows users to create habits, perform daily/weekly check-ins, track streaks, and visualize progress through a clean dashboard interface.

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | Angular 22, Tailwind v4, signals   |
| Backend  | NestJS 11, TypeORM 1.1, better-sqlite3 |
| Database | SQLite (single-file via better-sqlite3) |
| Docs     | Swagger / OpenAPI                   |

## Project Structure

```
2026-07-18-habitflow/
├── apps/
│   ├── api/                     # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts          # Bootstrap + Swagger + CORS
│   │   │   ├── app.module.ts    # Root module with TypeORM SQLite
│   │   │   ├── habits/          # Habits CRUD module
│   │   │   │   ├── habits.module.ts
│   │   │   │   ├── habits.controller.ts
│   │   │   │   ├── habits.service.ts
│   │   │   │   ├── entities/habit.entity.ts
│   │   │   │   └── dto/
│   │   │   ├── checkins/        # Check-in module
│   │   │   │   ├── checkins.module.ts
│   │   │   │   ├── checkins.controller.ts
│   │   │   │   ├── checkins.service.ts
│   │   │   │   ├── entities/checkin.entity.ts
│   │   │   │   └── dto/
│   │   │   └── dashboard/       # Dashboard aggregation module
│   │   │       ├── dashboard.module.ts
│   │   │       ├── dashboard.controller.ts
│   │   │       └── dashboard.service.ts
│   │   ├── data/                # SQLite DB files (gitignored)
│   │   └── dist/                # Compiled JS output
│   └── web/                     # Angular 22 frontend
│       └── src/
│           ├── index.html
│           ├── styles.css       # Tailwind v4 + custom theme
│           └── app/
│               ├── app.ts / app.html / app.config.ts / app.routes.ts
│               ├── models/habit.types.ts
│               ├── services/habit.service.ts
│               └── components/
│                   ├── navbar/          # Top navigation
│                   ├── dashboard/       # Main dashboard view
│                   ├── habit-form/      # Create/edit habit form
│                   ├── habit-detail/    # Habit detail + check-in
│                   └── heatmap-calendar/ # 30-day activity grid
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── FRONTEND.md
└── package.json (root workspace)
```

## Data Flow

1. User interacts with Angular UI (localhost:4200)
2. Angular makes HTTP requests to NestJS API (localhost:3000/api)
3. NestJS controllers handle routing, services contain business logic
4. TypeORM entities map to SQLite tables via better-sqlite3 driver
5. Swagger docs available at localhost:3000/api/docs

## Key Design Decisions

- **Signal-based Angular**: All components use signals for state management — no zone.js, no NgRx
- **Modular NestJS**: Each domain (habits, checkins, dashboard) has its own module with clear boundaries
- **Streak calculation**: Done server-side in `DashboardService` and also client-side in `HabitDetailComponent` for instant feedback
- **SQLite for simplicity**: Single database file, no external DB server needed; Neon-ready for production
- **Tailwind v4**: Uses `@theme` directives with a custom design system; pre-compiled before production build
