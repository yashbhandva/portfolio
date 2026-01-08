import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <i class="fas fa-tachometer-alt"></i>
            Dashboard
          </a>
          <a routerLink="/admin/projects" routerLinkActive="active" class="nav-item">
            <i class="fas fa-project-diagram"></i>
            Projects
          </a>
          <a routerLink="/admin/services" routerLinkActive="active" class="nav-item">
            <i class="fas fa-cogs"></i>
            Services
          </a>
          <a routerLink="/admin/contacts" routerLinkActive="active" class="nav-item">
            <i class="fas fa-envelope"></i>
            Contacts
          </a>
          <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
            <i class="fas fa-users"></i>
            Users
          </a>
          <a routerLink="/" class="nav-item">
            <i class="fas fa-home"></i>
            Back to Home
          </a>
          <button (click)="logout()" class="nav-item logout-btn">
            <i class="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </nav>
      </aside>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}