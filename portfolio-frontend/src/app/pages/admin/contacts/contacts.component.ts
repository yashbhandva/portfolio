import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contacts-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Contact Messages</h1>
          <p class="page-subtitle">Manage and respond to customer inquiries</p>
        </div>
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
            @for (contact of filteredContacts(); track contact.id) {
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
                    <button class="btn-icon btn-reply" (click)="replyContact(contact.id)" title="Reply">
                      <i class="fas fa-reply"></i>
                    </button>
                    @if (contact.status === 'NEW' || contact.status === 'IN_PROGRESS') {
                      <button class="btn-icon btn-resolve" (click)="markResolved(contact.id)" title="Mark Resolved">
                        <i class="fas fa-check"></i>
                      </button>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (filteredContacts().length === 0) {
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>No contacts found</h3>
          <p>No contact messages match your current filters</p>
        </div>
      }
    </div>
  `,
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  allContacts = signal<any[]>([]);
  filteredContacts = signal<any[]>([]);
  stats = signal({
    total: 0,
    pending: 0
  });

  searchTerm = '';
  selectedStatus = '';

  ngOnInit() {
    this.loadContacts();
  }

  private adminService = inject(AdminService);

  private loadContacts(): void {
    this.adminService.getAllContacts().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.allContacts.set(response.data);
          this.filteredContacts.set(response.data);
          this.stats.set({
            total: response.data.length,
            pending: response.data.filter(c => c.status === 'NEW' || c.status === 'PENDING').length
          });
        }
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
        console.error('Error details:', error.error);
        console.error('Status:', error.status);
        // Fallback to empty array
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
  }

  viewContact(contactId: number): void {
    console.log('View contact:', contactId);
  }

  replyContact(contactId: number): void {
    console.log('Reply to contact:', contactId);
  }

  markResolved(contactId: number): void {
    console.log('Mark resolved:', contactId);
  }
}