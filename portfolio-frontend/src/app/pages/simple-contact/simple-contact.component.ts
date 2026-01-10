import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-simple-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="simple-contact-page">
      <div class="container">
        <div class="contact-card">
          <div class="header">
            <h1>Contact Us</h1>
            <p>Have a question? We'd love to hear from you.</p>
          </div>

          @if (success()) {
            <div class="success-message">
              <i class="fas fa-check-circle"></i>
              <h3>Message Sent!</h3>
              <p>Thanks for reaching out. We'll get back to you shortly.</p>
              <button class="btn btn-outline" (click)="resetForm()">Send Another</button>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" #form="ngForm">
              <div class="form-group">
                <label>Name</label>
                <input type="text" [(ngModel)]="formData.name" name="name" required class="form-input" placeholder="Your Name">
              </div>

              <div class="form-group">
                <label>Email</label>
                <input type="email" [(ngModel)]="formData.email" name="email" required email class="form-input" placeholder="your@email.com">
              </div>

              <div class="form-group">
                <label>Subject</label>
                <input type="text" [(ngModel)]="formData.subject" name="subject" required class="form-input" placeholder="What is this about?">
              </div>

              <div class="form-group">
                <label>Message</label>
                <textarea [(ngModel)]="formData.message" name="message" required class="form-textarea" rows="5" placeholder="Your message..."></textarea>
              </div>

              <button type="submit" class="btn btn-primary" [disabled]="loading() || !form.valid">
                @if (loading()) {
                  <i class="fas fa-spinner fa-spin"></i> Sending...
                } @else {
                  <i class="fas fa-paper-plane"></i> Send Message
                }
              </button>
            </form>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .simple-contact-page {
      min-height: 100vh;
      background: #f8fafc;
      padding: 4rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      width: 100%;
      max-width: 500px;
    }
    .contact-card {
      background: white;
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 2rem;
      h1 { color: #1f2937; margin-bottom: 0.5rem; }
      p { color: #6b7280; }
    }
    .form-group {
      margin-bottom: 1.5rem;
      label { display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500; }
    }
    .form-input, .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      &:focus { outline: none; border-color: #2563eb; ring: 2px solid #bfdbfe; }
    }
    .btn {
      width: 100%;
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      &.btn-primary { background: #2563eb; color: white; &:hover { background: #1d4ed8; } }
      &.btn-outline { background: transparent; border: 1px solid #2563eb; color: #2563eb; margin-top: 1rem; }
      &:disabled { opacity: 0.7; cursor: not-allowed; }
    }
    .success-message {
      text-align: center;
      padding: 2rem 0;
      i { font-size: 3rem; color: #10b981; margin-bottom: 1rem; }
      h3 { color: #1f2937; margin-bottom: 0.5rem; }
      p { color: #6b7280; }
    }
  `]
})
export class SimpleContactComponent {
  private contactService = inject(ContactService);
  private authService = inject(AuthService);

  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  loading = signal(false);
  success = signal(false);

  constructor() {
    // Prefill if logged in
    const user = this.authService.currentUser();
    if (user) {
      // Use firstName + lastName if name is not available directly
      this.formData.name = (user.firstName + ' ' + (user.lastName || '')).trim();
      this.formData.email = user.email;
      this.formData.phone = user.phone || ''; // Fixed: phoneNumber -> phone
    }
  }

  onSubmit() {
    this.loading.set(true);
    this.contactService.createContact(this.formData).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.success.set(true);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.loading.set(false);
      }
    });
  }

  resetForm() {
    this.success.set(false);
    this.formData.subject = '';
    this.formData.message = '';
    // Keep name/email if logged in
  }
}