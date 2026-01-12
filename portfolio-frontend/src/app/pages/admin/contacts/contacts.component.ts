import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { PaginationControlsComponent } from '../../../components/pagination-controls/pagination-controls.component';

@Component({
  selector: 'app-admin-contacts.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationControlsComponent],
  template: `
  <!-- Hero Section -->
          <section class="portfolio-hero">
            <div class="container">
              <div class="hero-content">
                <h1 class="hero-title">Contact Messages</h1>
                <p class="hero-description">
                 Manage and respond to customer inquiries.
                </p>
              </div>
            </div>
          </section>
    <div class="contacts-container">
      <div class="page-header">

        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-number">{{ stats().total }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-item">
            <span class="stat-number pending">{{ stats().pending }}</span>
            <span class="stat-label">Pending</span>
          </div>
        </div>
      </div>

      <div class="filters-section">
        <div class="filters-container">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search contacts..." 
              [(ngModel)]="searchTerm"
              (input)="filterContacts()"
              class="search-input">
          </div>

          <div class="filter-group">
            <label class="filter-label">Status:</label>
            <select 
              [(ngModel)]="selectedStatus" 
              (change)="filterContacts()"
              class="filter-select">
              <option value="">All Status</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-container">
        <table class="contacts-table">
          <thead>
            <tr>
              <th>Contact</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (contact of paginatedContacts(); track contact.id) {
              <tr [class.unread]="contact.status === 'NEW'">
                <td>
                  <div class="contact-cell">
                    <div class="contact-avatar">
                      {{ contact.name.charAt(0) }}
                    </div>
                    <div class="contact-info">
                      <div class="contact-name">{{ contact.name }}</div>
                      <div class="contact-email">{{ contact.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="subject-cell">{{ contact.subject }}</td>
                <td class="message-cell">{{ contact.message?.slice(0, 80) }}...</td>
                <td>
                  <span class="status-badge" [class]="contact.status">
                    {{ contact.status }}
                  </span>
                </td>
                <td class="date-cell">{{ contact.createdAt | date:'shortDate' }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon btn-view" (click)="viewContact(contact.id)" title="View">
                      <i class="fas fa-eye"></i>
                    </button>

                    <button class="btn-icon btn-reply" (click)="replyContact(contact.id)" title="Reply"
                            *ngIf="contact.status !== 'RESOLVED'">
                      <i class="fas fa-reply"></i>
                    </button>

                    <button class="btn-icon btn-resolve" (click)="markResolved(contact.id)" title="Mark Resolved"
                            *ngIf="contact.status === 'NEW' || contact.status === 'IN_PROGRESS'">
                      <i class="fas fa-check"></i>
                    </button>
                  </div>

                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <app-pagination-controls
        [currentPage]="currentPage()"
        [pageSize]="pageSize()"
        [totalItems]="filteredContacts().length"
        (pageChange)="onPageChange($event)"
        (pageSizeChange)="onPageSizeChange($event)">
      </app-pagination-controls>

      @if (filteredContacts().length === 0) {
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>No contacts found</h3>
          <p>No contact messages match your current filters</p>
        </div>
      }

      <!-- View/Reply Modal -->
      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>{{ isReplying() ? 'Reply to Message' : 'Message Details' }}</h3>
              <button class="btn-close" (click)="closeModal()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              @if (selectedContact()) {
                <div class="message-details">
                  <div class="detail-row">
                    <label>From:</label>
                    <span>{{ selectedContact().name }} ({{ selectedContact().email }})</span>
                  </div>
                  <div class="detail-row">
                    <label>Subject:</label>
                    <span>{{ selectedContact().subject }}</span>
                  </div>
                  <div class="detail-row">
                    <label>Date:</label>
                    <span>{{ selectedContact().createdAt | date:'medium' }}</span>
                  </div>
                  <div class="detail-row message-content">
                    <label>Message:</label>
                    <p>{{ selectedContact().message }}</p>
                  </div>
                </div>

                @if (isReplying()) {
                  <div class="reply-form">
                    <div class="form-group">
                      <label>Your Reply:</label>
                      <textarea [(ngModel)]="replyMessage" class="form-textarea" rows="5" placeholder="Type your reply here..."></textarea>
                    </div>
                    <div class="form-actions">
                      <button class="btn btn-outline" (click)="isReplying.set(false)">Cancel</button>
                      <button class="btn btn-primary" (click)="sendReply()" [disabled]="sending() || !replyMessage">
                        @if (sending()) {
                          <i class="fas fa-spinner fa-spin"></i> Sending...
                        } @else {
                          <i class="fas fa-paper-plane"></i> Send Reply
                        }
                      </button>
                    </div>
                  </div>
                } @else {
                  <div class="modal-actions">
                    <button class="btn btn-primary" (click)="isReplying.set(true)">
                      <i class="fas fa-reply"></i> Reply
                    </button>
                    @if (selectedContact().status !== 'RESOLVED') {
                      <button class="btn btn-success" (click)="markResolved(selectedContact().id)">
                        <i class="fas fa-check"></i> Mark Resolved
                      </button>
                    }
                  </div>
                }
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  private adminService = inject(AdminService);

  allContacts = signal<any[]>([]);
  filteredContacts = signal<any[]>([]);
  stats = signal({
    total: 0,
    pending: 0
  });

  searchTerm = '';
  selectedStatus = '';

  // Pagination
  currentPage = signal(1);
  pageSize = signal(10);

  // Computed signal for paginated data
  paginatedContacts = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.filteredContacts().slice(startIndex, endIndex);
  });

  // Modal state
  showModal = signal(false);
  isReplying = signal(false);
  selectedContact = signal<any>(null);
  replyMessage = '';
  sending = signal(false);

  ngOnInit() {
    this.loadContacts();
  }

  private loadContacts(): void {
    this.adminService.getAllContacts().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.allContacts.set(response.data);
          this.filterContacts();
          this.stats.set({
            total: response.data.length,
            pending: response.data.filter(c => c.status === 'NEW' || c.status === 'IN_PROGRESS').length
          });
        }
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
        this.allContacts.set([]);
        this.filteredContacts.set([]);
      }
    });
  }

  filterContacts(): void {
    let filtered = [...this.allContacts()];

    if (this.searchTerm && this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(contact =>
        (contact.name && contact.name.toLowerCase().includes(searchLower)) ||
        (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
        (contact.subject && contact.subject.toLowerCase().includes(searchLower)) ||
        (contact.message && contact.message.toLowerCase().includes(searchLower))
      );
    }

    if (this.selectedStatus && this.selectedStatus.trim()) {
      filtered = filtered.filter(contact => contact.status === this.selectedStatus);
    }

    this.filteredContacts.set(filtered);
    this.currentPage.set(1); // Reset to page 1 on filter
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  viewContact(contactId: number): void {
    const contact = this.allContacts().find(c => c.id === contactId);
    if (contact) {
      this.selectedContact.set(contact);
      this.isReplying.set(false);
      this.showModal.set(true);

      // If status is NEW, mark as IN_PROGRESS
      if (contact.status === 'NEW') {
        this.updateStatus(contactId, 'IN_PROGRESS');
      }
    }
  }

  replyContact(contactId: number): void {
    const contact = this.allContacts().find(c => c.id === contactId);
    if (contact) {
      this.selectedContact.set(contact);
      this.isReplying.set(true);
      this.replyMessage = '';
      this.showModal.set(true);
    }
  }

  markResolved(contactId: number): void {
    this.updateStatus(contactId, 'RESOLVED');
    this.closeModal();
  }

  updateStatus(contactId: number, status: string): void {
    this.adminService.updateContactStatus(contactId, status).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.loadContacts();
        }
      },
      error: (error) => console.error('Error updating status:', error)
    });
  }

  sendReply(): void {
    if (!this.replyMessage || !this.selectedContact()) return;

    this.sending.set(true);
    const contactId = this.selectedContact().id;

    this.adminService.replyToContact(contactId, this.replyMessage).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.sending.set(false);
          this.closeModal();
          this.loadContacts(); // Will show as RESOLVED
        }
      },
      error: (error) => {
        console.error('Error sending reply:', error);
        this.sending.set(false);
      }
    });
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedContact.set(null);
    this.replyMessage = '';
  }
}