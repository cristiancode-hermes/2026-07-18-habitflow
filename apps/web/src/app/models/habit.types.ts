export interface Habit {
  id: number;
  name: string;
  description: string | null;
  category: HabitCategory;
  frequency: HabitFrequency;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  checkins?: CheckIn[];
}

export interface CreateHabitRequest {
  name: string;
  description?: string;
  category?: HabitCategory;
  frequency?: HabitFrequency;
  color?: string;
  icon?: string;
}

export interface UpdateHabitRequest {
  name?: string;
  description?: string;
  category?: HabitCategory;
  frequency?: HabitFrequency;
  color?: string;
  icon?: string;
}

export interface CheckIn {
  id: number;
  habitId: number;
  date: string;
  note: string | null;
  createdAt: string;
}

export interface CreateCheckInRequest {
  date?: string;
  note?: string;
}

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

export type HabitCategory =
  | 'health'
  | 'learning'
  | 'productivity'
  | 'creativity'
  | 'finance'
  | 'social'
  | 'mindfulness'
  | 'other';

export type HabitFrequency = 'daily' | 'weekly';

export const CATEGORY_LABELS: Record<HabitCategory, string> = {
  health: 'Health',
  learning: 'Learning',
  productivity: 'Productivity',
  creativity: 'Creativity',
  finance: 'Finance',
  social: 'Social',
  mindfulness: 'Mindfulness',
  other: 'Other',
};

export const CATEGORY_COLORS: Record<HabitCategory, string> = {
  health: '#22c55e',
  learning: '#3b82f6',
  productivity: '#f59e0b',
  creativity: '#ec4899',
  finance: '#10b981',
  social: '#8b5cf6',
  mindfulness: '#a855f7',
  other: '#64748b',
};
