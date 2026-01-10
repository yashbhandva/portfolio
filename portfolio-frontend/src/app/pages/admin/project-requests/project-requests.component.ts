import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-project-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-requests">
      <div class="page-header">
        <div class="header-left">
          <h1>Project Requests</h1>
          <p>Manage incoming project requests from clients</p>
        </div>
      </div>

      @if (loading()) {
        <div class="loading">Loading requests...</div>
      } @else {
        <div class="table-container">
          <table class="requests-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Project</th>
                <th>Service</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (request of requests(); track request.id) {
                <tr>
                  <td>
                    <div class="client-info">
                      <div class="client-name">{{ request.client?.name || 'Unknown' }}</div>
                      <div class="client-email">{{ request.client?.email }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="project-info">
                      <div class="project-title">{{ request.projectTitle }}</div>
                      <div class="project-desc" title="{{ request.projectDescription }}">
                        {{ request.projectDescription?.slice(0, 50) }}...
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="service-badge" *ngIf="request.service">
                      {{ request.service.name }}
                    </span>
                  </td>
                  <td>{{ request.budget | currency }}</td>
                  <td>
                    <span class="status-badge" [ngClass]="request.status">
                      {{ request.status }}
                    </span>
                  </td>
                  <td>{{ request.createdAt | date:'mediumDate' }}</td>
                  <td>
                    <div class="action-buttons">
                      <!-- Check for PENDING status (case-insensitive) -->
                      @if (isPending(request.status)) {
                        <button
                          class="btn-approve"
                          (click)="approveRequest(request.id)"
                          [disabled]="updating() === request.id">
                          <i class="fas fa-check"></i> Approve
                        </button>
                      }
                      <select
                        [ngModel]="request.status"
                        (ngModelChange)="updateStatus(request.id, $event)"
                        class="status-select"
                        [disabled]="updating() === request.id">
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (!loading() && requests().length === 0) {
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>No project requests</h3>
          <p>New requests will appear here</p>
        </div>
      }
    </div>
  `,
  styleUrls: ['./project-requests.component.scss']
})
export class AdminProjectRequestsComponent implements OnInit {
  private adminService = inject(AdminService);

  loading = signal(false);
  updating = signal<number | null>(null);
  requests = signal<any[]>([]);

  ngOnInit() {
    this.loadRequests();
  }

  private loadRequests() {
    this.loading.set(true);
    this.adminService.getAllProjectRequests().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          console.log('Loaded requests:', response.data); // Debug log
          this.requests.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.loading.set(false);
      }
    });
  }

  isPending(status: string): boolean {
    return status === 'PENDING' || status === 'Pending';
  }

  updateStatus(id: number, newStatus: string) {
    this.updating.set(id);
    this.adminService.updateProjectRequestStatus(id, newStatus).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.loadRequests(); // Reload to reflect changes
        }
        this.updating.set(null);
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.updating.set(null);
      }
    });
  }

  approveRequest(id: number) {
    this.updating.set(id);
    this.adminService.approveProjectRequest(id).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.loadRequests(); // Reload to show status change
        }
        this.updating.set(null);
      },
      error: (error) => {
        console.error('Error approving request:', error);
        this.updating.set(null);
      }
    });
  }
}