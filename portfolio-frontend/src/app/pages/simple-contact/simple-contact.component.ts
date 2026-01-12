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
   <!-- Hero Section -->
      <section class="portfolio-hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">Contact Us </h1>
            <p class="hero-description">
             Get in touch with us to discuss your ideas
             and see how we can turn them into powerful digital solutions.
            </p>
          </div>
        </div>
      </section>

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
  styleUrls: ['./simple-contact.component.scss']
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
      this.formData.name = (user.firstName + ' ' + (user.lastName || '')).trim();
      this.formData.email = user.email;
      this.formData.phone = user.phone || '';
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