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
          <h1 class="hero-title">Get In Touch</h1>
          <p class="hero-description">
            Ready to start your project? Have questions about our services? 
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
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
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you within 24 hours.</p>
            </div>

            <!-- Success Message -->
            @if (contactService.submissionSuccess()) {
              <div class="success-message">
                <div class="success-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                <button class="btn btn-outline" (click)="resetForm()">
                  Send Another Message
                </button>
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
                    @if (firstNameField.invalid && firstNameField.touched) {
                      <div class="error-text">
                        @if (firstNameField.errors?.['required']) {
                          First name is required
                        }
                        @if (firstNameField.errors?.['minlength']) {
                          First name must be at least 2 characters
                        }
                      </div>
                    }
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
                    @if (lastNameField.invalid && lastNameField.touched) {
                      <div class="error-text">
                        @if (lastNameField.errors?.['required']) {
                          Last name is required
                        }
                        @if (lastNameField.errors?.['minlength']) {
                          Last name must be at least 2 characters
                        }
                      </div>
                    }
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
                    @if (email.invalid && email.touched) {
                      <div class="error-text">
                        @if (email.errors?.['required']) {
                          Email is required
                        }
                        @if (email.errors?.['email']) {
                          Please enter a valid email address
                        }
                      </div>
                    }
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
                    @if (phone.invalid && phone.touched) {
                      <div class="error-text">
                        Please enter a valid phone number
                      </div>
                    }
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="subject" class="form-label">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      [(ngModel)]="formData.subject"
                      #subject="ngModel"
                      required
                      [class.error]="subject.invalid && subject.touched"
                      class="form-select">
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Careers">Careers</option>
                      <option value="Other">Other</option>
                    </select>
                    @if (subject.invalid && subject.touched) {
                      <div class="error-text">
                        Please select a subject
                      </div>
                    }
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
                    Message *
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
                    placeholder="Tell us about your project or inquiry..."></textarea>
                  @if (message.invalid && message.touched) {
                    <div class="error-text">
                      @if (message.errors?.['required']) {
                        Message is required
                      }
                      @if (message.errors?.['minlength']) {
                        Message must be at least 10 characters
                      }
                      @if (message.errors?.['maxlength']) {
                        Message cannot exceed 500 characters
                      }
                    </div>
                  }
                  <div class="char-count">
                    {{ formData.message.length || 0 }}/500 characters
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary btn-large submit-btn"
                  [disabled]="contactService.loading() || contactForm.invalid">
                  @if (contactService.loading()) {
                    <i class="fas fa-spinner fa-spin"></i>
                    Sending...
                  } @else {
                    <i class="fas fa-paper-plane"></i>
                    Send Message
                  }
                </button>
              </form>
            }
          </div>

          <!-- Contact Info -->
          <div class="contact-info">
            <div class="info-header">
              <h2>Contact Information</h2>
              <p>Here's how you can reach us</p>
            </div>

            <div class="info-items">
              <div class="info-item">
                <div class="info-icon">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="info-content">
                  <h3>Our Office</h3>
                  <p>123 Tech Street<br>Innovation District<br>City, State 12345</p>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">
                  <i class="fas fa-phone"></i>
                </div>
                <div class="info-content">
                  <h3>Phone Number</h3>
                  <p>+1 (555) 123-4567</p>
                  <small>Monday - Friday, 9:00 AM - 6:00 PM</small>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="info-content">
                  <h3>Email Address</h3>
                  <p>hello&#64;portfolio.com</p>
                  <p>support&#64;portfolio.com</p>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="info-content">
                  <h3>Working Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div class="social-section">
              <h3>Follow Us</h3>
              <div class="social-links">
                <a href="#" class="social-link" aria-label="Facebook">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="social-link" aria-label="Twitter">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="social-link" aria-label="Instagram">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="social-link" aria-label="LinkedIn">
                  <i class="fab fa-linkedin-in"></i>
                </a>
                <a href="#" class="social-link" aria-label="GitHub">
                  <i class="fab fa-github"></i>
                </a>
              </div>
            </div>

            <!-- Map Placeholder -->
            <div class="map-section">
              <h3>Find Us</h3>
              <div class="map-placeholder">
                <i class="fas fa-map-marked-alt"></i>
                <p>Interactive Map</p>
                <small>Google Maps Integration</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-description">
            Find quick answers to common questions about our services and process
          </p>
        </div>

        <div class="faq-grid">
          <div class="faq-item" [class.active]="activeFaq() === 1">
            <div class="faq-question" (click)="toggleFaq(1)">
              <h3>How long does a typical project take?</h3>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
              <p>
                Project timelines vary based on complexity and scope. A simple website typically takes 4-6 weeks, 
                while complex web applications can take 8-12 weeks. We provide detailed timelines during our initial consultation.
              </p>
            </div>
          </div>

          <div class="faq-item" [class.active]="activeFaq() === 2">
            <div class="faq-question" (click)="toggleFaq(2)">
              <h3>What is your pricing structure?</h3>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
              <p>
                We offer both fixed-price projects and hourly rates depending on project requirements. 
                Web development starts at $1,500, mobile apps at $2,500, and design services at $1,200. 
                Contact us for a detailed quote tailored to your needs.
              </p>
            </div>
          </div>

          <div class="faq-item" [class.active]="activeFaq() === 3">
            <div class="faq-question" (click)="toggleFaq(3)">
              <h3>Do you provide ongoing support?</h3>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
              <p>
                Yes, we offer comprehensive maintenance and support packages. This includes technical support, 
                security updates, performance monitoring, and feature enhancements. Support plans start at $200/month.
              </p>
            </div>
          </div>

          <div class="faq-item" [class.active]="activeFaq() === 4">
            <div class="faq-question" (click)="toggleFaq(4)">
              <h3>What technologies do you work with?</h3>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
              <p>
                We work with modern technologies including Angular, React, Vue.js, Spring Boot, Node.js, 
                Flutter, React Native, and various databases. We choose the best stack for your specific project requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="contact-cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Still Have Questions?</h2>
          <p class="cta-description">
            Don't hesitate to reach out. We're here to help you bring your ideas to life.
          </p>
          <div class="cta-buttons">
            <a href="tel:+15551234567" class="btn btn-primary btn-large">
              <i class="fas fa-phone"></i>
              Call Us Now
            </a>
            <a href="mailto:hello@portfolio.com" class="btn btn-outline btn-large">
              <i class="fas fa-envelope"></i>
              Send Email
            </a>
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

  // Signals
  activeFaq = signal<number | null>(null);

  // Form data
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
  selectedBudget: string = '0'; // New field for budget

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

      // Handle name (firstName + lastName)
      if (user.firstName) {
        this.firstName = user.firstName;
        this.lastName = user.lastName || '';
        this.updateFullName();
      }

      // Handle phone
      if (user.phone) {
        this.formData.phone = user.phone;
      }
    }
  }

  private checkPreSelectedService(): void {
    // Check if service is pre-selected from query params
    this.route.queryParams.subscribe(params => {
      if (params['service']) {
        this.formData.subject = params['service'];
      }
      if (params['serviceId']) {
        this.selectedServiceId = +params['serviceId'];
      }
      if (params['project']) {
        this.formData.subject = 'Project Inquiry';
        this.formData.message = `I'm interested in discussing a project similar to "${params['project']}". `;
      }
    });
  }

  private initFormAnimations(): void {
    // Add form field animations
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

  // Form submission
  onSubmit(): void {
    const user = this.authService.currentUser();

    // If user is logged in, treat as a project request
    if (user && user.id) {
      const projectRequest = {
        projectTitle: this.formData.subject,
        projectDescription: this.formData.message,
        serviceId: this.selectedServiceId || 1, // Use selected service ID or default to 1
        budget: +this.selectedBudget, // Use selected budget
        timelineDays: 30,
        priority: 'MEDIUM'
      };

      this.clientService.createProjectRequest(projectRequest).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.contactService.submissionSuccess.set(true);
            // Optionally redirect to client dashboard
            setTimeout(() => {
              this.router.navigate(['/client']);
            }, 2000);
          }
        },
        error: (error) => {
          this.contactService.submissionError.set(error.error?.message || 'Failed to submit request');
        }
      });
    } else {
      // Standard contact form submission for guests
      const contactData: ContactRequest = {
        name: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone || undefined,
        subject: this.formData.subject,
        message: this.formData.message
      };

      this.contactService.createContact(contactData).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.contactService.submissionSuccess.set(true);
          }
        },
        error: (error) => {
          this.contactService.submissionError.set(error.error?.message || 'Failed to send message');
        }
      });
    }
  }

  // FAQ methods
  toggleFaq(index: number): void {
    this.activeFaq.set(this.activeFaq() === index ? null : index);
  }

  // Form reset
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