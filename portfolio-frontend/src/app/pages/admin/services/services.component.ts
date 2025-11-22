import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-services">
      <div class="page-header">
        <h1>Services Management</h1>
        <p>Manage your portfolio services</p>
        <button class="btn btn-primary" (click)="showAddForm()">
          <i class="fas fa-plus"></i>
          Add New Service
        </button>
      </div>

      @if (loading()) {
        <div class="loading">Loading services...</div>
      } @else {
        <div class="table-container">
          <table class="services-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Delivery</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (service of services(); track service.id) {
                <tr>
                  <td>
                    <div class="service-info">
                      <div class="service-name">{{ service.name }}</div>
                      <div class="service-description">{{ service.description }}</div>
                    </div>
                  </td>
                  <td><span class="category-badge">{{ service.category }}</span></td>
                  <td class="price-cell">\${{ service.startingPrice }}</td>
                  <td>{{ service.deliveryDays }} days</td>
                  <td>
                    <span class="status-badge" [class.active]="service.active">
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
      }

      @if (!loading() && services().length === 0) {
        <div class="empty-state">
          <i class="fas fa-cogs"></i>
          <h3>No services found</h3>
          <p>Start by adding your first service</p>
        </div>
      }

      <!-- Add/Edit Service Form -->
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
                <label>Description *</label>
                <textarea [(ngModel)]="serviceData.description" name="description" required class="form-textarea" rows="3"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Starting Price *</label>
                  <input type="number" [(ngModel)]="serviceData.startingPrice" name="startingPrice" required class="form-input" step="0.01">
                </div>
                <div class="form-group">
                  <label>Delivery Days *</label>
                  <input type="number" [(ngModel)]="serviceData.deliveryDays" name="deliveryDays" required class="form-input">
                </div>
              </div>
              <div class="form-group">
                <label>Features</label>
                <textarea [(ngModel)]="serviceData.features" name="features" class="form-textarea" rows="2" placeholder="e.g., Responsive Design, SEO Optimized"></textarea>
              </div>
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="serviceData.active" name="active">
                  <span class="checkmark"></span>
                  Active Service
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

  serviceData = {
    name: '',
    description: '',
    category: '',
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
      description: '',
      category: '',
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