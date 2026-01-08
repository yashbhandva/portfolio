import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProjectService } from '../../../services/project.service';
import { AdminService } from '../../../services/admin.service';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="client-dashboard">
      <div class="dashboard-header">
        <h1>Welcome back, {{ currentUser()?.name || currentUser()?.firstName || 'User' }}!</h1>
        <p>Explore our portfolio and services</p>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-project-diagram"></i>
          </div>
          <div class="stat-content">
            <h3>{{ projectsCount() }}</h3>
            <p>Active Projects</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-cogs"></i>
          </div>
          <div class="stat-content">
            <h3>{{ servicesCount() }}</h3>
            <p>Available Services</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="stat-content">
            <h3>{{ messagesCount() }}</h3>
            <p>Messages</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-content">
            <h3>{{ loading() ? '...' : 'Active' }}</h3>
            <p>Account Status</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <a routerLink="/contact" class="action-card">
            <i class="fas fa-plus"></i>
            <span>New Project Request</span>
          </a>
          <a routerLink="/services" class="action-card">
            <i class="fas fa-eye"></i>
            <span>View Services</span>
          </a>
          <a routerLink="/portfolio" class="action-card">
            <i class="fas fa-folder"></i>
            <span>Browse Portfolio</span>
          </a>
          <a routerLink="/contact" class="action-card">
            <i class="fas fa-envelope"></i>
            <span>Contact Support</span>
          </a>
        </div>
      </div>

      <!-- Recent Projects -->
      <div class="recent-activity">
        <h2>Recent Projects</h2>
        <div class="activity-list" *ngIf="!loading(); else loadingTemplate">
          <div class="activity-item" *ngFor="let project of recentProjects()">
            <i class="fas fa-project-diagram"></i>
            <div class="activity-content">
              <p>{{ project.projectTitle }}</p>
              <span class="activity-time">{{ project.status }} • {{ project.createdAt | date:'mediumDate' }}</span>
            </div>
          </div>
          <div class="activity-item" *ngIf="recentProjects().length === 0">
            <i class="fas fa-info-circle"></i>
            <div class="activity-content">
              <p>No projects available</p>
              <span class="activity-time">Explore our services to get started</span>
            </div>
          </div>
        </div>
        <ng-template #loadingTemplate>
          <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading dashboard data...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private projectService = inject(ProjectService);
  private adminService = inject(AdminService);
  private clientService = inject(ClientService);
  
  currentUser = signal<any>(null);
  projectsCount = signal(0);
  servicesCount = signal(0);
  messagesCount = signal(0);
  recentProjects = signal<any[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.currentUser.set(this.authService.currentUser());
    this.loadDashboardData();
    
    // Refresh data every 30 seconds
    setInterval(() => {
      this.refreshMessagesCount();
    }, 30000);
  }

  refreshMessagesCount() {
    const userEmail = this.currentUser()?.email;
    if (userEmail) {
      this.clientService.getMyMessagesCount(userEmail).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.messagesCount.set(response.data);
          }
        },
        error: (error) => console.error('Error refreshing messages:', error)
      });
    }
  }

  private loadDashboardData() {
    this.loading.set(true);
    const user = this.currentUser();

    if (user && user.id) {
      // Load client's project requests
      this.clientService.getMyProjectRequests(user.id).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.projectsCount.set(response.data.length);
            this.recentProjects.set(response.data.slice(0, 3));
          }
        },
        error: (error) => console.error('Error loading projects:', error)
      });
    }

    // Load services count
    this.adminService.getAllServices().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.servicesCount.set(response.data.length);
        }
      },
      error: (error) => console.error('Error loading services:', error)
    });

    // Load user's messages count
    const userEmail = this.currentUser()?.email;
    if (userEmail) {
      this.clientService.getMyMessagesCount(userEmail).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.messagesCount.set(response.data);
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading messages:', error);
          this.messagesCount.set(0);
          this.loading.set(false);
        }
      });
    } else {
      this.messagesCount.set(0);
      this.loading.set(false);
    }
  }
}