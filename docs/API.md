# HabitFlow API Reference

Base URL: `http://localhost:3000/api`
Swagger UI: `http://localhost:3000/api/docs`

## Habits

### List All Habits
```
GET /api/habits
```
Returns all habits ordered by creation date (newest first).

### Get Habit with Check-ins
```
GET /api/habits/:id
```
Returns a single habit with all related check-in records.

### Create Habit
```
POST /api/habits
Content-Type: application/json

{
  "name": "Morning jog",
  "description": "Run for 20 minutes every morning",
  "category": "health",
  "frequency": "daily",
  "color": "#6366f1",
  "icon": "star"
}
```

| Field       | Type   | Required | Default    | Description                     |
|-------------|--------|----------|------------|---------------------------------|
| name        | string | yes      | -          | Habit name (max 120 chars)      |
| description | string | no       | null       | Optional description            |
| category    | enum   | no       | "other"    | health, learning, productivity, creativity, finance, social, mindfulness, other |
| frequency   | enum   | no       | "daily"    | daily or weekly                 |
| color       | string | no       | "#6366f1"  | Hex color for UI display        |
| icon        | string | no       | "star"     | Icon identifier                 |

### Update Habit
```
PATCH /api/habits/:id
Content-Type: application/json
```
Partial update. All fields from Create are optional.

### Delete Habit
```
DELETE /api/habits/:id
```
Cascades to delete all associated check-ins.

## Check-ins

### Create Check-in (for today)
```
POST /api/habits/:habitId/checkin
Content-Type: application/json

{
  "date": "2026-07-18",
  "note": "Felt great!"
}
```

| Field | Type   | Required | Default     | Description                 |
|-------|--------|----------|-------------|-----------------------------|
| date  | string | no       | today       | ISO date (YYYY-MM-DD)       |
| note  | string | no       | null        | Optional note about check-in |

Returns `409 Conflict` if a check-in already exists for that habit+date.

### Get Check-ins for Habit
```
GET /api/habits/:habitId/checkins
```
Returns all check-ins for a habit, ordered by date descending.

### Delete Check-in by ID
```
DELETE /api/checkins/:id
```

### Delete Check-in by Habit + Date
```
DELETE /api/habits/:habitId/checkin?date=2026-07-18
```

## Dashboard

### Get Dashboard Overview
```
GET /api/dashboard
```

Returns aggregated data for all active habits:

```json
{
  "totalHabits": 3,
  "activeHabits": 3,
  "totalCheckins": 47,
  "todayCheckins": 2,
  "habits": [
    {
      "id": 1,
      "name": "Morning jog",
      "category": "health",
      "color": "#6366f1",
      "icon": "star",
      "frequency": "daily",
      "totalCheckins": 20,
      "currentStreak": 5,
      "longestStreak": 14,
      "completionRate": 67,
      "lastCheckinDate": "2026-07-18"
    }
  ],
  "bestStreak": {
    "name": "Morning jog",
    "streak": 5
  }
}
```

## Entity Relationships

```
Habit (1) ──── (N) CheckIn
  ├── id (PK)
  ├── name
  ├── category (enum)
  ├── frequency (enum: daily/weekly)
  ├── color
  └── isActive

CheckIn
  ├── id (PK)
  ├── habitId (FK → Habit.id)
  ├── date (unique per habitId + date)
  └── note
```
