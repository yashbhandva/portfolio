import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `

     <!-- Hero Section -->
        <section class="portfolio-hero">
          <div class="container">
            <div class="hero-content">
              <h1 class="hero-title">Admin Dashboard</h1>
              <p class="hero-description">
               Manage, monitor, and lead — all from one powerful dashboard.
              </p>
            </div>
          </div>
        </section>

    <div class="admin-dashboard">


      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-project-diagram"></i>
          </div>
          <div class="stat-content">
            <h3>{{ projectsCount() }}</h3>
            <p>Total Projects</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-cogs"></i>
          </div>
          <div class="stat-content">
            <h3>{{ servicesCount() }}</h3>
            <p>Services</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="stat-content">
            <h3>{{ contactsCount() }}</h3>
            <p>Contact Messages</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <h3>{{ usersCount() }}</h3>
            <p>Registered Users</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <a routerLink="/admin/projects" class="action-card">
            <i class="fas fa-plus"></i>
            <span>Add New Project</span>
          </a>
          <a routerLink="/admin/services" class="action-card">
            <i class="fas fa-cog"></i>
            <span>Manage Services</span>
          </a>
          <a routerLink="/admin/contacts" class="action-card">
            <i class="fas fa-inbox"></i>
            <span>View Messages</span>
          </a>
          <a routerLink="/admin/users" class="action-card">
            <i class="fas fa-user-cog"></i>
            <span>Manage Users</span>
          </a>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <h2>Recent Activity</h2>
        @if (loading()) {
          <div class="loading">Loading...</div>
        } @else {
          <div class="activity-list">
            <div class="activity-item">
              <i class="fas fa-project-diagram"></i>
              <span>{{ projectsCount() }} projects available</span>
            </div>
            <div class="activity-item">
              <i class="fas fa-envelope"></i>
              <span>{{ contactsCount() }} contact messages</span>
            </div>
            <div class="activity-item">
              <i class="fas fa-users"></i>
              <span>{{ usersCount() }} registered users</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  
  loading = signal(false);
  projectsCount = signal(0);
  servicesCount = signal(0);
  contactsCount = signal(0);
  usersCount = signal(0);

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.loading.set(true);
    
    // Load projects count
    this.adminService.getAllProjects().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.projectsCount.set(response.data.length);
        }
      },
      error: (error) => console.error('Error loading projects:', error)
    });

    // Load contacts count
    this.adminService.getAllContacts().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.contactsCount.set(response.data.length);
        }
      },
      error: (error) => console.error('Error loading contacts:', error)
    });

    // Load services count
    this.adminService.getAllServices().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.servicesCount.set(response.data.length);
        }
      },
      error: (error) => console.error('Error loading services:', error)
    });

    // Load users count
    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.usersCount.set(response.data.length);
        }
      },
      error: (error) => console.error('Error loading users:', error),
      complete: () => this.loading.set(false)
    });
  }
}