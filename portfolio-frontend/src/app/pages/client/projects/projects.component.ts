import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-client-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="projects-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">My Projects</h1>
          <p class="page-subtitle">Track and manage your project requests</p>
        </div>
      </div>

      <div class="filters-section">
        <div class="filters-container">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input
              type="text"
              class="search-input"
              placeholder="Search projects..."
              [(ngModel)]="searchTerm"
              (ngModelChange)="filterProjects()">
          </div>
          <div class="filter-group">
            <select
              class="filter-select"
              [(ngModel)]="statusFilter"
              (ngModelChange)="filterProjects()">
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div class="projects-grid" *ngIf="!loading(); else loadingTemplate">
        <div class="project-card" *ngFor="let project of filteredProjects()">
          <div class="project-header">
            <div class="title-section">
              <h3 class="project-title">{{ project.projectTitle }}</h3>
              <span class="service-badge" *ngIf="project.service">
                <i class="fas fa-tag"></i> {{ project.service.name }}
              </span>
            </div>
            <span class="project-status" [ngClass]="project.status">{{ project.status }}</span>
          </div>

          <p class="project-description">{{ project.projectDescription }}</p>

          <div class="project-details">
            <div class="detail-item">
              <i class="fas fa-calendar-alt"></i>
              <span>Created: {{ project.createdAt | date:'mediumDate' }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-clock"></i>
              <span>Timeline: {{ project.timelineDays }} days</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-money-bill-wave"></i>
              <span>Budget: {{ project.budget | currency }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-flag"></i>
              <span>Priority: {{ project.priority }}</span>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="filteredProjects().length === 0">
          <i class="fas fa-folder-open"></i>
          <h3>No Projects Found</h3>
          <p>You haven't submitted any project requests yet.</p>
        </div>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Loading your projects...</p>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./projects.component.scss']
})
export class ClientProjectsComponent implements OnInit {
  private clientService = inject(ClientService);
  private authService = inject(AuthService);

  projects = signal<any[]>([]);
  filteredProjects = signal<any[]>([]);
  loading = signal(true);

  searchTerm = '';
  statusFilter = 'ALL';

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.clientService.getMyProjectRequests().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.projects.set(response.data);
          this.filterProjects();
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading.set(false);
      }
    });
  }

  filterProjects() {
    let filtered = this.projects();

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.projectTitle.toLowerCase().includes(term) ||
        p.projectDescription.toLowerCase().includes(term)
      );
    }

    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(p => p.status === this.statusFilter);
    }

    this.filteredProjects.set(filtered);
  }
}