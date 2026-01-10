import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

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
          <a routerLink="/admin/requests" routerLinkActive="active" class="nav-item">
            <i class="fas fa-inbox"></i>
            Requests
          </a>
          <a routerLink="/admin/projects" routerLinkActive="active" class="nav-item">
            <i class="fas fa-project-diagram"></i>
            Portfolio
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
      <div class="main-panel">
        <header class="dashboard-header">
          <div class="header-content">
            <!-- Notification Bell -->
            <div class="notification-wrapper">
              <button class="notification-btn" (click)="toggleNotifications()">
                <i class="fas fa-bell"></i>
                <span class="badge" *ngIf="notificationService.unreadCount() > 0">
                  {{ notificationService.unreadCount() }}
                </span>
              </button>

              <!-- Notification Dropdown -->
              <div class="notification-dropdown" *ngIf="showNotifications()">
                <div class="dropdown-header">
                  <h3>Notifications</h3>
                  <button class="mark-all-btn" (click)="markAllRead()">Mark all read</button>
                </div>
                <div class="dropdown-body">
                  <div class="notification-item"
                       *ngFor="let notification of notificationService.notifications()"
                       [class.unread]="!notification.read"
                       (click)="markRead(notification)">
                    <div class="notification-icon">
                      <i class="fas" [ngClass]="getIcon(notification.type)"></i>
                    </div>
                    <div class="notification-content">
                      <h4>{{ notification.title }}</h4>
                      <p>{{ notification.message }}</p>
                      <span class="time">{{ notification.createdAt | date:'short' }}</span>
                    </div>
                  </div>
                  <div class="empty-notifications" *ngIf="notificationService.notifications().length === 0">
                    <p>No notifications</p>
                  </div>
                </div>
              </div>
            </div>

            <span class="welcome-message">
              Welcome, Admin
            </span>
            <button (click)="logout()" class="header-logout-btn">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </header>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  notificationService = inject(NotificationService);
  private router = inject(Router);

  showNotifications = signal(false);

  ngOnInit() {
    this.notificationService.loadUnreadCount();
  }

  toggleNotifications() {
    this.showNotifications.set(!this.showNotifications());
    if (this.showNotifications()) {
      this.notificationService.loadNotifications().subscribe();
    }
  }

  markRead(notification: any) {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe();
    }
  }

  markAllRead() {
    this.notificationService.markAllAsRead().subscribe();
  }

  getIcon(type: string): string {
    switch (type) {
      case 'PROJECT_REQUEST': return 'fa-file-alt';
      case 'PROJECT_UPDATE': return 'fa-sync';
      case 'PAYMENT': return 'fa-credit-card';
      default: return 'fa-info-circle';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}