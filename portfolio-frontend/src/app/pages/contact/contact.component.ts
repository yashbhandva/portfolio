import { Component, OnInit, signal, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../services/auth.service';
import { ContactRequest } from '../../models/contact.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Start a Project</h1>
          <p class="hero-description">
            Ready to bring your idea to life? Fill out the form below with your project details, and we'll get back to you with a plan.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
      <div class="container">
        <div class="contact-content">
          <!-- Contact Form -->
          <div class="contact-form-container">
            <div class="form-header">
              <h2>Project Details</h2>
              <p>The more details you provide, the better we can assist you.</p>
            </div>

            <!-- Success Message -->
            @if (contactService.submissionSuccess()) {
              <div class="success-message">
                <div class="success-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <h3>Request Sent Successfully!</h3>
                <p>Thank you for your request. We'll review it and get back to you within 24 hours.</p>
                <button class="btn btn-outline" (click)="resetForm()">Send Another Request</button>
              </div>
            }

            <!-- Contact Form -->
            @if (!contactService.submissionSuccess()) {
              <form (ngSubmit)="onSubmit()" class="contact-form" #contactForm="ngForm">
                <!-- Error Message -->
                @if (contactService.submissionError()) {
                  <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    {{ contactService.submissionError() }}
                  </div>
                }

                <div class="form-row">
                  <div class="form-group">
                    <label for="firstName" class="form-label">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      [(ngModel)]="firstName"
                      (ngModelChange)="updateFullName()"
                      #firstNameField="ngModel"
                      required
                      minlength="2"
                      [class.error]="firstNameField.invalid && firstNameField.touched"
                      class="form-input"
                      placeholder="Enter your first name">
                  </div>

                  <div class="form-group">
                    <label for="lastName" class="form-label">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      [(ngModel)]="lastName"
                      (ngModelChange)="updateFullName()"
                      #lastNameField="ngModel"
                      required
                      minlength="2"
                      [class.error]="lastNameField.invalid && lastNameField.touched"
                      class="form-input"
                      placeholder="Enter your last name">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="email" class="form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      [(ngModel)]="formData.email"
                      #email="ngModel"
                      required
                      email
                      [class.error]="email.invalid && email.touched"
                      class="form-input"
                      placeholder="Enter your email address">
                  </div>

                  <div class="form-group">
                    <label for="phone" class="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      [(ngModel)]="formData.phone"
                      #phone="ngModel"
                      pattern="[0-9+\-\s\(\)]+"
                      [class.error]="phone.invalid && phone.touched"
                      class="form-input"
                      placeholder="Enter your phone number">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="subject" class="form-label">
                      Project Type / Service *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      [(ngModel)]="formData.subject"
                      #subject="ngModel"
                      required
                      [class.error]="subject.invalid && subject.touched"
                      class="form-select">
                      <option value="">Select a service...</option>
                      <option value="Project Inquiry">New Project Inquiry</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Other">Other Project Type</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="budget" class="form-label">
                      Estimated Budget
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      [(ngModel)]="selectedBudget"
                      class="form-select">
                      <option value="0">Select a budget range</option>
                      <option value="500">$500 - $1,000</option>
                      <option value="1000">$1,000 - $2,500</option>
                      <option value="2500">$2,500 - $5,000</option>
                      <option value="5000">$5,000 - $10,000</option>
                      <option value="10000">$10,000+</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label for="message" class="form-label">
                    Project Description *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    [(ngModel)]="formData.message"
                    #message="ngModel"
                    required
                    minlength="10"
                    maxlength="500"
                    [class.error]="message.invalid && message.touched"
                    class="form-textarea"
                    rows="6"
                    placeholder="Describe your project requirements..."></textarea>
                  <div class="char-count">
                    {{ formData.message.length || 0 }}/500 characters
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary btn-large submit-btn"
                  [disabled]="contactService.loading() || contactForm.invalid">
                  @if (contactService.loading()) {
                    <i class="fas fa-spinner fa-spin"></i> Sending Request...
                  } @else {
                    <i class="fas fa-paper-plane"></i> Submit Project Request
                  }
                </button>
              </form>
            }
          </div>

          <!-- Contact Info -->
          <div class="contact-info">
            <div class="info-header">
              <h2>Need Help?</h2>
              <p>If you have a general question, feel free to reach out.</p>
            </div>
            <div class="info-items">
              <a routerLink="/contact" class="btn btn-outline">
                <i class="fas fa-envelope"></i> Send a General Message
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, AfterViewInit {
  contactService = inject(ContactService);
  clientService = inject(ClientService);
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  activeFaq = signal<number | null>(null);

  formData: ContactRequest = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };
  
  firstName = '';
  lastName = '';
  selectedServiceId: number | null = null;
  selectedBudget: string = '0';

  ngOnInit() {
    this.checkPreSelectedService();
    this.prefillUserData();
  }

  ngAfterViewInit() {
    this.initFormAnimations();
  }

  private prefillUserData(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.formData.email = user.email;
      if (user.firstName) {
        this.firstName = user.firstName;
        this.lastName = user.lastName || '';
        this.updateFullName();
      }
      if (user.phone) {
        this.formData.phone = user.phone;
      }
    }
  }

  private checkPreSelectedService(): void {
    this.route.queryParams.subscribe(params => {
      if (params['service']) {
        this.formData.subject = params['service'];
      }
      if (params['serviceId']) {
        this.selectedServiceId = +params['serviceId'];
      }
    });
  }

  private initFormAnimations(): void {
    const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    formInputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement?.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        if (!(input as HTMLInputElement).value) {
          input.parentElement?.classList.remove('focused');
        }
      });
    });
  }

  updateFullName(): void {
    this.formData.name = `${this.firstName} ${this.lastName}`.trim();
  }

  onSubmit(): void {
    const user = this.authService.currentUser();

    // All submissions from this form are now Project Requests if the user is logged in.
    if (user && user.id) {
      const projectRequest = {
        projectTitle: this.formData.subject,
        projectDescription: this.formData.message,
        serviceId: this.selectedServiceId || 1,
        budget: +this.selectedBudget,
        timelineDays: 30,
        priority: 'MEDIUM'
      };

      this.clientService.createProjectRequest(projectRequest).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.contactService.submissionSuccess.set(true);
            setTimeout(() => {
              this.router.navigate(['/client/projects']);
            }, 2000);
          }
        },
        error: (error) => {
          this.contactService.submissionError.set(error.error?.message || 'Failed to submit request');
        }
      });
    } else {
      // If user is not logged in, redirect to login or show an error
      this.contactService.submissionError.set('You must be logged in to submit a project request.');
      // Optionally, redirect to login
      // this.router.navigate(['/login']);
    }
  }

  resetForm(): void {
    this.contactService.resetSubmissionState();
    this.firstName = '';
    this.lastName = '';
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
    this.selectedServiceId = null;
    this.selectedBudget = '0';
  }
}