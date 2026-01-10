import { Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects/projects.component').then(m => m.AdminProjectsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'requests', // New route for Project Requests
    loadComponent: () => import('./project-requests/project-requests.component').then(m => m.AdminProjectRequestsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'services',
    loadComponent: () => import('./services/services.component').then(m => m.AdminServicesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'team',
    loadComponent: () => import('./team/team.component').then(m => m.TeamComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'contacts',
    loadComponent: () => import('./contacts/contacts.component').then(m => m.ContactsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'payments',
    loadComponent: () => import('./payments/payments.component').then(m => m.AdminPaymentsComponent),
    canActivate: [AuthGuard]
  }
];