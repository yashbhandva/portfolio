import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { PaginationControlsComponent } from '../../../components/pagination-controls/pagination-controls.component';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationControlsComponent],
  template: `
  <!-- Hero Section -->
          <section class="portfolio-hero">
            <div class="container">
              <div class="hero-content">
                <h1 class="hero-title">Services Management</h1>
                <p class="hero-description">
                 Manage and add new services.
                </p>
              </div>
            </div>
          </section>
    <div class="services-container">
      <div class="page-header">
        <button class="btn btn-primary" (click)="showAddForm()">
          <i class="fas fa-plus"></i>
          Add New Service
        </button>
      </div>

      @if (showForm()) {
        <div class="form-modal">
          <div class="form-container">
            <div class="form-header">
              <h2>{{ editingService() ? 'Edit Service' : 'Add New Service' }}</h2>
              <button class="btn-close" (click)="hideForm()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <form (ngSubmit)="saveService()" #serviceForm="ngForm">
              <div class="form-row">
                <div class="form-group">
                  <label>Name *</label>
                  <input type="text" [(ngModel)]="serviceData.name" name="name" required class="form-input">
                </div>
                <div class="form-group">
                  <label>Category *</label>
                  <input type="text" [(ngModel)]="serviceData.category" name="category" required class="form-input">
                </div>
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea [(ngModel)]="serviceData.description" name="description" class="form-textarea" rows="3"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Starting Price</label>
                  <input type="number" [(ngModel)]="serviceData.startingPrice" name="startingPrice" class="form-input">
                </div>
                <div class="form-group">
                  <label>Delivery Days</label>
                  <input type="number" [(ngModel)]="serviceData.deliveryDays" name="deliveryDays" class="form-input">
                </div>
              </div>
              <div class="form-group">
                <label>Features (comma-separated)</label>
                <input type="text" [(ngModel)]="serviceData.features" name="features" class="form-input">
              </div>
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="serviceData.active" name="active">
                  <span class="checkmark"></span>
                  Active
                </label>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-outline" (click)="hideForm()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving() || !serviceForm.valid">
                  @if (saving()) {
                    <i class="fas fa-spinner fa-spin"></i>
                    Saving...
                  } @else {
                    <i class="fas fa-save"></i>
                    {{ editingService() ? 'Update' : 'Create' }} Service
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="loading">Loading services...</div>
      } @else {
        <div class="table-container">
          <table class="services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Price</th>
                <th>Delivery</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (service of paginatedServices(); track service.id) {
                <tr>
                  <td>{{ service.name }}</td>
                  <td>{{ service.category }}</td>
                  <td>{{ service.startingPrice | currency }}</td>
                  <td>{{ service.deliveryDays }} days</td>
                  <td>
                    <span class="status-badge" [class]="service.active ? 'active' : 'inactive'">
                      {{ service.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-icon btn-edit" (click)="editService(service)" title="Edit">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn-icon btn-delete" (click)="deleteService(service.id)" title="Delete">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <app-pagination-controls
          [currentPage]="currentPage()"
          [pageSize]="pageSize()"
          [totalItems]="services().length"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)">
        </app-pagination-controls>
      }
    </div>
  `,
  styleUrls: ['./services.component.scss']
})
export class AdminServicesComponent implements OnInit {
  private adminService = inject(AdminService);

  loading = signal(false);
  saving = signal(false);
  showForm = signal(false);
  editingService = signal<any>(null);
  services = signal<any[]>([]);

  // Pagination
  currentPage = signal(1);
  pageSize = signal(10);

  paginatedServices = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.services().slice(startIndex, endIndex);
  });

  serviceData = {
    name: '',
    category: '',
    description: '',
    startingPrice: 0,
    deliveryDays: 0,
    features: '',
    active: true
  };

  ngOnInit() {
    this.loadServices();
  }

  private loadServices() {
    this.loading.set(true);
    this.adminService.getAllServices().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.services.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.loading.set(false);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  showAddForm() {
    this.resetForm();
    this.editingService.set(null);
    this.showForm.set(true);
  }

  editService(service: any) {
    this.serviceData = { ...service };
    this.editingService.set(service);
    this.showForm.set(true);
  }

  hideForm() {
    this.showForm.set(false);
    this.resetForm();
  }

  resetForm() {
    this.serviceData = {
      name: '',
      category: '',
      description: '',
      startingPrice: 0,
      deliveryDays: 0,
      features: '',
      active: true
    };
  }

  saveService() {
    this.saving.set(true);
    
    const operation = this.editingService() 
      ? this.adminService.updateService(this.editingService().id, this.serviceData)
      : this.adminService.createService(this.serviceData);

    operation.subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.loadServices();
          this.hideForm();
        }
        this.saving.set(false);
      },
      error: (error) => {
        console.error('Error saving service:', error);
        this.saving.set(false);
      }
    });
  }

  deleteService(serviceId: number) {
    if (confirm('Are you sure you want to delete this service?')) {
      this.adminService.deleteService(serviceId).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.loadServices();
          }
        },
        error: (error) => {
          console.error('Error deleting service:', error);
        }
      });
    }
  }
}