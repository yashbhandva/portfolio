import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="client-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Client Portal</h2>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/client" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <i class="fas fa-tachometer-alt"></i>
            Dashboard
          </a>
          <a routerLink="/client/projects" routerLinkActive="active" class="nav-item">
            <i class="fas fa-project-diagram"></i>
            My Projects
          </a>
          <a routerLink="/client/payments" routerLinkActive="active" class="nav-item">
            <i class="fas fa-credit-card"></i>
            Payments
          </a>
          <a routerLink="/client/profile" routerLinkActive="active" class="nav-item">
            <i class="fas fa-user"></i>
            Profile
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
  styleUrls: ['./client-layout.component.scss']
})
export class ClientLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}