import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">User Management</h1>
          <p class="page-subtitle">Manage client accounts and permissions</p>
        </div>
      </div>

      <div class="table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Projects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users(); track user.id) {
              <tr>
                <td>
                  <div class="user-cell">
                    <div class="user-avatar">
                      {{ user.name.charAt(0) }}
                    </div>
                    <div class="user-info">
                      <div class="user-name">{{ user.name }}</div>
                      <div class="user-phone" *ngIf="user.phoneNumber">{{ user.phoneNumber }}</div>
                    </div>
                  </div>
                </td>
                <td class="email-cell">{{ user.email }}</td>
                <td>
                  <span class="role-badge" [class]="user.role">
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" [class]="user.enabled ? 'active' : 'inactive'">
                    {{ user.enabled ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="date-cell">{{ user.createdAt | date:'shortDate' }}</td>
                <td class="projects-cell">0</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" (click)="viewUser(user.id)" title="View">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" (click)="editUser(user.id)" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-danger" (click)="deleteUser(user.id)" title="Delete">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- View User Modal -->
      @if (showViewModal()) {
        <div class="modal-overlay" (click)="closeViewModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>User Details</h3>
              <button class="btn-close" (click)="closeViewModal()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              @if (selectedUser()) {
                <div class="user-details">
                  <div class="detail-row">
                    <label>Name:</label>
                    <span>{{ selectedUser().name }}</span>
                  </div>
                  <div class="detail-row">
                    <label>Email:</label>
                    <span>{{ selectedUser().email }}</span>
                  </div>
                  <div class="detail-row">
                    <label>Phone:</label>
                    <span>{{ selectedUser().phoneNumber || 'Not provided' }}</span>
                  </div>
                  <div class="detail-row">
                    <label>Role:</label>
                    <span class="role-badge" [class]="selectedUser().role">{{ selectedUser().role }}</span>
                  </div>
                  <div class="detail-row">
                    <label>Status:</label>
                    <span class="status-badge" [class]="selectedUser().enabled ? 'active' : 'inactive'">
                      {{ selectedUser().enabled ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  <div class="detail-row">
                    <label>Joined:</label>
                    <span>{{ selectedUser().createdAt | date:'medium' }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- Edit User Modal -->
      @if (showEditModal()) {
        <div class="modal-overlay" (click)="closeEditModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Edit User</h3>
              <button class="btn-close" (click)="closeEditModal()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              @if (selectedUser()) {
                <form (ngSubmit)="saveUser()" #userForm="ngForm">
                  <div class="form-group">
                    <label>Name *</label>
                    <input type="text" [(ngModel)]="editUserData.name" name="name" required class="form-input">
                  </div>
                  <div class="form-group">
                    <label>Email *</label>
                    <input type="email" [(ngModel)]="editUserData.email" name="email" required class="form-input">
                  </div>
                  <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" [(ngModel)]="editUserData.phoneNumber" name="phoneNumber" class="form-input">
                  </div>
                  <div class="form-group">
                    <label>Role *</label>
                    <select [(ngModel)]="editUserData.role" name="role" required class="form-input">
                      <option value="CLIENT">Client</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="checkbox-label">
                      <input type="checkbox" [(ngModel)]="editUserData.enabled" name="enabled">
                      <span class="checkmark"></span>
                      Active User
                    </label>
                  </div>
                  <div class="form-actions">
                    <button type="button" class="btn btn-outline" (click)="closeEditModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" [disabled]="saving() || !userForm.valid">
                      @if (saving()) {
                        <i class="fas fa-spinner fa-spin"></i>
                        Saving...
                      } @else {
                        <i class="fas fa-save"></i>
                        Save Changes
                      }
                    </button>
                  </div>
                </form>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private adminService = inject(AdminService);
  
  users = signal<any[]>([]);
  selectedUser = signal<any>(null);
  showViewModal = signal(false);
  showEditModal = signal(false);
  saving = signal(false);

  editUserData = {
    name: '',
    email: '',
    phoneNumber: '',
    role: 'CLIENT',
    enabled: true
  };

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.users.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.users.set([]);
      }
    });
  }

  viewUser(userId: number): void {
    const user = this.users().find(u => u.id === userId);
    if (user) {
      this.selectedUser.set(user);
      this.showViewModal.set(true);
    }
  }

  editUser(userId: number): void {
    const user = this.users().find(u => u.id === userId);
    if (user) {
      this.selectedUser.set(user);
      this.editUserData = {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        role: user.role,
        enabled: user.enabled
      };
      this.showEditModal.set(true);
    }
  }

  saveUser(): void {
    this.saving.set(true);
    const userId = this.selectedUser().id;
    
    this.adminService.updateUser(userId, this.editUserData).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.saving.set(false);
          this.closeEditModal();
          this.loadUsers();
        }
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.saving.set(false);
      }
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.loadUsers();
          }
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  closeViewModal(): void {
    this.showViewModal.set(false);
    this.selectedUser.set(null);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedUser.set(null);
  }
}