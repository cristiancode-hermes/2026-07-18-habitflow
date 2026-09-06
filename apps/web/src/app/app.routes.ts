import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
  },
  {
    path: 'habits/new',
    loadComponent: () =>
      import('./components/habit-form/habit-form.component').then(
        (c) => c.HabitFormComponent
      ),
  },
  {
    path: 'habits/:id',
    loadComponent: () =>
      import('./components/habit-detail/habit-detail.component').then(
        (c) => c.HabitDetailComponent
      ),
  },
  {
    path: 'habits/:id/edit',
    loadComponent: () =>
      import('./components/habit-form/habit-form.component').then(
        (c) => c.HabitFormComponent
      ),
  },
];
