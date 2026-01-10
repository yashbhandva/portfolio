import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client.service';
import { AuthService } from '../../../services/auth.service';
import { PaginationControlsComponent } from '../../../components/pagination-controls/pagination-controls.component';

@Component({
  selector: 'app-client-messages',
  standalone: true,
  imports: [CommonModule, PaginationControlsComponent],
  template: `
    <div class="messages-container">
      <div class="page-header">
        <h1>My Messages</h1>
        <p>View your inquiries and admin responses</p>
      </div>

      @if (loading()) {
        <div class="loading">Loading messages...</div>
      } @else {
        <div class="messages-list">
          @for (message of paginatedMessages(); track message.id) {
            <div class="message-card">
              <div class="message-header">
                <div class="subject-section">
                  <h3>{{ message.subject }}</h3>
                  <span class="status-badge" [ngClass]="message.status">
                    {{ message.status }}
                  </span>
                </div>
                <span class="date">{{ message.createdAt | date:'medium' }}</span>
              </div>

              <div class="message-body">
                <p>{{ message.message }}</p>
              </div>

              @if (message.adminReply) {
                <div class="admin-reply">
                  <div class="reply-header">
                    <i class="fas fa-reply"></i>
                    <strong>Admin Response</strong>
                    <span class="reply-date">{{ message.repliedAt | date:'medium' }}</span>
                  </div>
                  <p>{{ message.adminReply }}</p>
                </div>
              }
            </div>
          }
        </div>

        <app-pagination-controls
          *ngIf="!loading()"
          [currentPage]="currentPage()"
          [pageSize]="pageSize()"
          [totalItems]="messages().length"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)">
        </app-pagination-controls>
      }

      @if (!loading() && messages().length === 0) {
        <div class="empty-state">
          <i class="fas fa-envelope-open"></i>
          <h3>No messages found</h3>
          <p>You haven't sent any general inquiries yet.</p>
        </div>
      }
    </div>
  `,
  styleUrls: ['./messages.component.scss']
})
export class ClientMessagesComponent implements OnInit {
  private clientService = inject(ClientService);
  private authService = inject(AuthService);

  messages = signal<any[]>([]);
  loading = signal(false);

  // Pagination
  currentPage = signal(1);
  pageSize = signal(10);

  paginatedMessages = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.messages().slice(startIndex, endIndex);
  });

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.loading.set(true);
    const user = this.authService.currentUser();
    if (user) {
      this.clientService.getMyMessages(user.id).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.messages.set(response.data);
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading messages:', error);
          this.loading.set(false);
        }
      });
    }
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }
}