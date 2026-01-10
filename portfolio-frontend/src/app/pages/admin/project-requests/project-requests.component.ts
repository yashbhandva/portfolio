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
                <th>Status (Debug)</th>
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
                      <button class="btn-icon btn-message" (click)="openMessageModal(request)" title="Message Client">
                        <i class="fas fa-comment-alt"></i>
                      </button>

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

      <!-- Message Modal -->
      @if (showMessageModal()) {
        <div class="modal-overlay" (click)="closeMessageModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Message Client</h3>
              <button class="btn-close" (click)="closeMessageModal()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>To:</label>
                <input type="text" [value]="selectedRequest()?.client?.name" disabled class="form-input">
              </div>
              <div class="form-group">
                <label>Subject:</label>
                <input type="text" [(ngModel)]="messageSubject" class="form-input" placeholder="Subject">
              </div>
              <div class="form-group">
                <label>Message:</label>
                <textarea [(ngModel)]="messageBody" class="form-textarea" rows="5" placeholder="Type your message..."></textarea>
              </div>
              <div class="form-actions">
                <button class="btn btn-outline" (click)="closeMessageModal()">Cancel</button>
                <button class="btn btn-primary" (click)="sendMessage()" [disabled]="sending() || !messageBody">
                  @if (sending()) {
                    <i class="fas fa-spinner fa-spin"></i> Sending...
                  } @else {
                    <i class="fas fa-paper-plane"></i> Send Message
                  }
                </button>
              </div>
            </div>
          </div>
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

  // Message Modal
  showMessageModal = signal(false);
  selectedRequest = signal<any>(null);
  messageSubject = '';
  messageBody = '';
  sending = signal(false);

  ngOnInit() {
    this.loadRequests();
  }

  private loadRequests() {
    this.loading.set(true);
    this.adminService.getAllProjectRequests().subscribe({
      next: (response) => {
        if (response.status === 'success') {
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
    if (!status) return false;
    return status.toUpperCase() === 'PENDING';
  }

  updateStatus(id: number, newStatus: string) {
    this.updating.set(id);
    this.adminService.updateProjectRequestStatus(id, newStatus).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.loadRequests();
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
          this.loadRequests();
        }
        this.updating.set(null);
      },
      error: (error) => {
        console.error('Error approving request:', error);
        this.updating.set(null);
      }
    });
  }

  openMessageModal(request: any) {
    this.selectedRequest.set(request);
    this.messageSubject = `Regarding your project: ${request.projectTitle}`;
    this.messageBody = '';
    this.showMessageModal.set(true);
  }

  closeMessageModal() {
    this.showMessageModal.set(false);
    this.selectedRequest.set(null);
  }

  sendMessage() {
    if (!this.selectedRequest() || !this.messageBody) return;

    this.sending.set(true);
    const payload = {
      userId: this.selectedRequest().client.id,
      title: this.messageSubject,
      message: this.messageBody,
      broadcast: false
    };

    this.adminService.sendNotification(payload).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.closeMessageModal();
          alert('Message sent successfully!');
        }
        this.sending.set(false);
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.sending.set(false);
      }
    });
  }
}