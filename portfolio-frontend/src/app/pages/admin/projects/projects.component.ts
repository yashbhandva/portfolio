import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <!-- Hero Section -->
          <section class="portfolio-hero">
            <div class="container">
              <div class="hero-content">
                <h1 class="hero-title">Projects Management</h1>
                <p class="hero-description">
                 Manage your projects.
                </p>
              </div>
            </div>
          </section>
    <div class="admin-projects">
      <div class="page-header">

        <button class="btn btn-primary" (click)="showAddForm()">
          <i class="fas fa-plus"></i>
          Add New Project
        </button>
      </div>

      <!-- Add/Edit Project Form -->
      @if (showForm()) {
        <div class="form-modal">
          <div class="form-container">
            <div class="form-header">
              <h2>{{ editingProject() ? 'Edit Project' : 'Add New Project' }}</h2>
              <button class="btn-close" (click)="hideForm()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <form (ngSubmit)="saveProject()" #projectForm="ngForm">
              <div class="form-row">
                <div class="form-group">
                  <label>Title *</label>
                  <input type="text" [(ngModel)]="projectData.title" name="title" required class="form-input">
                </div>
                <div class="form-group">
                  <label>Category *</label>
                  <input type="text" [(ngModel)]="projectData.category" name="category" required class="form-input">
                </div>
              </div>
              <div class="form-group">
                <label>Description *</label>
                <textarea [(ngModel)]="projectData.description" name="description" required class="form-textarea" rows="3"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Technologies</label>
                  <input type="text" [(ngModel)]="projectData.technologies" name="technologies" class="form-input" placeholder="e.g., React, Spring Boot, MySQL">
                </div>
                <div class="form-group">
                  <label>Project URL</label>
                  <input type="url" [(ngModel)]="projectData.projectUrl" name="projectUrl" class="form-input">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Image URL</label>
                  <input type="url" [(ngModel)]="projectData.imageUrl" name="imageUrl" class="form-input">
                </div>
                <div class="form-group">
                  <label>GitHub URL</label>
                  <input type="url" [(ngModel)]="projectData.githubUrl" name="githubUrl" class="form-input">
                </div>
              </div>
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="projectData.featured" name="featured">
                  <span class="checkmark"></span>
                  Featured Project
                </label>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-outline" (click)="hideForm()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving() || !projectForm.valid">
                  @if (saving()) {
                    <i class="fas fa-spinner fa-spin"></i>
                    Saving...
                  } @else {
                    <i class="fas fa-save"></i>
                    {{ editingProject() ? 'Update' : 'Create' }} Project
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="loading">Loading projects...</div>
      } @else {
        <div class="table-container">
          <table class="projects-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Technologies</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (project of projects(); track project.id) {
                <tr>
                  <td>
                    <div class="project-cell">
                      <img [src]="project.imageUrl || 'https://via.placeholder.com/50x50/ddd/999?text=IMG'" [alt]="project.title" class="project-thumb">
                      <div class="project-info">
                        <div class="project-title">{{ project.title }}</div>
                        <div class="project-description">{{ project.description?.slice(0, 60) }}...</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="category-badge">{{ project.category }}</span></td>
                  <td><span class="tech-list">{{ project.technologies }}</span></td>
                  <td>
                    <span class="status-badge" [class.featured]="project.featured">
                      <i class="fas fa-star" *ngIf="project.featured"></i>
                      {{ project.featured ? 'Featured' : 'Regular' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-icon btn-edit" (click)="editProject(project)" title="Edit">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn-icon btn-delete" (click)="deleteProject(project.id)" title="Delete">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (!loading() && projects().length === 0) {
        <div class="empty-state">
          <i class="fas fa-folder-open"></i>
          <h3>No projects found</h3>
          <p>Start by adding your first project</p>
        </div>
      }
    </div>
  `,
  styleUrls: ['./projects.component.scss']
})
export class AdminProjectsComponent implements OnInit {
  private adminService = inject(AdminService);
  
  loading = signal(false);
  saving = signal(false);
  showForm = signal(false);
  editingProject = signal<any>(null);
  projects = signal<any[]>([]);

  projectData = {
    title: '',
    description: '',
    category: '',
    technologies: '',
    projectUrl: '',
    githubUrl: '',
    imageUrl: '',
    featured: false
  };

  ngOnInit() {
    this.loadProjects();
  }

  private loadProjects() {
    this.loading.set(true);
    this.adminService.getAllProjects().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.projects.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading.set(false);
      }
    });
  }

  showAddForm() {
    this.resetForm();
    this.editingProject.set(null);
    this.showForm.set(true);
  }

  editProject(project: any) {
    this.projectData = { ...project };
    this.editingProject.set(project);
    this.showForm.set(true);
  }

  hideForm() {
    this.showForm.set(false);
    this.resetForm();
  }

  resetForm() {
    this.projectData = {
      title: '',
      description: '',
      category: '',
      technologies: '',
      projectUrl: '',
      githubUrl: '',
      imageUrl: '',
      featured: false
    };
  }

  saveProject() {
    this.saving.set(true);
    
    const operation = this.editingProject() 
      ? this.adminService.updateProject(this.editingProject().id, this.projectData)
      : this.adminService.createProject(this.projectData);

    operation.subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.loadProjects();
          this.hideForm();
        }
        this.saving.set(false);
      },
      error: (error) => {
        console.error('Error saving project:', error);
        this.saving.set(false);
      }
    });
  }

  deleteProject(projectId: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.adminService.deleteProject(projectId).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.loadProjects();
          }
        },
        error: (error) => {
          console.error('Error deleting project:', error);
        }
      });
    }
  }
}