import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Habit,
  CreateHabitRequest,
  UpdateHabitRequest,
  CheckIn,
  CreateCheckInRequest,
  DashboardResponse,
} from '../models/habit.types';

@Injectable({ providedIn: 'root' })
export class HabitService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.baseUrl}/dashboard`);
  }

  getHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(`${this.baseUrl}/habits`);
  }

  getHabit(id: number): Observable<Habit> {
    return this.http.get<Habit>(`${this.baseUrl}/habits/${id}`);
  }

  createHabit(dto: CreateHabitRequest): Observable<Habit> {
    return this.http.post<Habit>(`${this.baseUrl}/habits`, dto);
  }

  updateHabit(id: number, dto: UpdateHabitRequest): Observable<Habit> {
    return this.http.patch<Habit>(`${this.baseUrl}/habits/${id}`, dto);
  }

  deleteHabit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/habits/${id}`);
  }

  checkIn(habitId: number, dto: CreateCheckInRequest): Observable<CheckIn> {
    return this.http.post<CheckIn>(`${this.baseUrl}/habits/${habitId}/checkin`, dto);
  }

  getCheckIns(habitId: number): Observable<CheckIn[]> {
    return this.http.get<CheckIn[]>(`${this.baseUrl}/habits/${habitId}/checkins`);
  }

  deleteCheckIn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/checkins/${id}`);
  }

  deleteCheckInByDate(habitId: number, date: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/habits/${habitId}/checkin?date=${date}`
    );
  }
}
