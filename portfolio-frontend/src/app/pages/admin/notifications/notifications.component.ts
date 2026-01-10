import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-notifications">
      <div class="page-header">
        <div class="header-left">
          <h1>Notifications</h1>
          <p>Send updates and announcements to users</p>
        </div>
      </div>

      <div class="content-grid">
        <!-- Send Notification Form -->
        <div class="card send-form">
          <h2>Send Notification</h2>
          <form (ngSubmit)="sendNotification()" #notificationForm="ngForm">
            <div class="form-group">
              <label>Recipient</label>
              <select [(ngModel)]="notificationData.recipientType" name="recipientType" class="form-select" (change)="onRecipientTypeChange()">
                <option value="BROADCAST">All Users (Broadcast)</option>
                <option value="SPECIFIC">Specific User</option>
              </select>
            </div>

            @if (notificationData.recipientType === 'SPECIFIC') {
              <div class="form-group">
                <label>Select User</label>
                <select [(ngModel)]="notificationData.userId" name="userId" class="form-select" required>
                  <option value="" disabled selected>Choose a user...</option>
                  @for (user of users(); track user.id) {
                    <option [value]="user.id">{{ user.name }} ({{ user.email }})</option>
                  }
                </select>
              </div>
            }

            <div class="form-group">
              <label>Title</label>
              <input type="text" [(ngModel)]="notificationData.title" name="title" class="form-input" required placeholder="Notification Title">
            </div>

            <div class="form-group">
              <label>Message</label>
              <textarea [(ngModel)]="notificationData.message" name="message" class="form-textarea" rows="4" required placeholder="Type your message here..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="sending() || !notificationForm.valid">
              @if (sending()) {
                <i class="fas fa-spinner fa-spin"></i> Sending...
              } @else {
                <i class="fas fa-paper-plane"></i> Send Notification
              }
            </button>

            @if (successMessage()) {
              <div class="success-alert">
                <i class="fas fa-check-circle"></i> {{ successMessage() }}
              </div>
            }
          </form>
        </div>

        <!-- Recent System Notifications -->
        <div class="card recent-list">
          <h2>Recent System Notifications</h2>
          <div class="notification-list">
            @for (notification of recentNotifications(); track notification.id) {
              <div class="notification-item">
                <div class="icon">
                  <i class="fas fa-bell"></i>
                </div>
                <div class="content">
                  <h4>{{ notification.title }}</h4>
                  <p>{{ notification.message }}</p>
                  <span class="time">{{ notification.createdAt | date:'medium' }}</span>
                </div>
              </div>
            }
            @if (recentNotifications().length === 0) {
              <p class="empty-text">No recent notifications sent.</p>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./notifications.component.scss']
})
export class AdminNotificationsComponent implements OnInit {
  private adminService = inject(AdminService);
  private notificationService = inject(NotificationService); // For viewing own notifications if needed

  users = signal<any[]>([]);
  sending = signal(false);
  successMessage = signal('');
  recentNotifications = signal<any[]>([]); // This would ideally come from a "sent notifications" endpoint

  notificationData = {
    recipientType: 'BROADCAST',
    userId: '',
    title: '',
    message: ''
  };

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.users.set(response.data);
        }
      }
    });
  }

  onRecipientTypeChange() {
    if (this.notificationData.recipientType === 'BROADCAST') {
      this.notificationData.userId = '';
    }
  }

  sendNotification() {
    this.sending.set(true);
    this.successMessage.set('');

    const payload = {
      title: this.notificationData.title,
      message: this.notificationData.message,
      broadcast: this.notificationData.recipientType === 'BROADCAST',
      userId: this.notificationData.userId ? +this.notificationData.userId : undefined
    };

    this.adminService.sendNotification(payload).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.successMessage.set('Notification sent successfully!');
          this.resetForm();

          // Add to local recent list for feedback
          this.recentNotifications.update(list => [
            { ...payload, id: Date.now(), createdAt: new Date() },
            ...list
          ]);

          setTimeout(() => this.successMessage.set(''), 3000);
        }
        this.sending.set(false);
      },
      error: (error) => {
        console.error('Error sending notification:', error);
        this.sending.set(false);
      }
    });
  }

  resetForm() {
    this.notificationData = {
      recipientType: 'BROADCAST',
      userId: '',
      title: '',
      message: ''
    };
  }
}