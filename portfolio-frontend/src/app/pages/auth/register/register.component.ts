import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <a routerLink="/" class="logo">
            <i class="fas fa-code"></i>
            Portfolio
          </a>
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Sign up to get started with our services</p>
        </div>

        <form class="auth-form" (ngSubmit)="onSubmit()" #registerForm="ngForm">
          @if (errorMessage()) {
            <div class="alert alert-error">
              <i class="fas fa-exclamation-circle"></i>
              {{ errorMessage() }}
            </div>
          }

          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">
                <i class="fas fa-user"></i>
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                [(ngModel)]="firstName"
                (ngModelChange)="updateFullName()"
                required
                class="form-input"
                placeholder="Enter your first name">
            </div>

            <div class="form-group">
              <label for="lastName" class="form-label">
                <i class="fas fa-user"></i>
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                [(ngModel)]="lastName"
                (ngModelChange)="updateFullName()"
                required
                class="form-input"
                placeholder="Enter your last name">
            </div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">
              <i class="fas fa-envelope"></i>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="registerData.email"
              required
              email
              class="form-input"
              placeholder="Enter your email address">
          </div>

          <div class="form-group">
            <label for="phoneNumber" class="form-label">
              <i class="fas fa-phone"></i>
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              [(ngModel)]="registerData.phoneNumber"
              class="form-input"
              placeholder="Enter your phone number">
          </div>

          <div class="form-group">
            <label for="company" class="form-label">
              <i class="fas fa-building"></i>
              Company (Optional)
            </label>
            <input
              type="text"
              id="company"
              name="company"
              [(ngModel)]="registerData.company"
              class="form-input"
              placeholder="Enter your company name">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password" class="form-label">
                <i class="fas fa-lock"></i>
                Password
              </label>
              <div class="password-input-container">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  id="password"
                  name="password"
                  [(ngModel)]="registerData.password"
                  required
                  minlength="6"
                  class="form-input"
                  placeholder="Create password">
                <button
                  type="button"
                  class="password-toggle"
                  (click)="togglePasswordVisibility()">
                  <i [class]="showPassword() ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">
                <i class="fas fa-lock"></i>
                Confirm Password
              </label>
              <div class="password-input-container">
                <input
                  [type]="showConfirmPassword() ? 'text' : 'password'"
                  id="confirmPassword"
                  name="confirmPassword"
                  [(ngModel)]="confirmPassword"
                  required
                  class="form-input"
                  placeholder="Confirm password">
                <button
                  type="button"
                  class="password-toggle"
                  (click)="toggleConfirmPasswordVisibility()">
                  <i [class]="showConfirmPassword() ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input
                type="checkbox"
                [(ngModel)]="agreeToTerms"
                name="agreeToTerms"
                required
                class="checkbox-input">
              <span class="checkmark"></span>
              I agree to the 
              <a routerLink="/terms-of-service" target="_blank" class="terms-link">Terms of Service</a>
              and 
              <a routerLink="/privacy-policy" target="_blank" class="terms-link">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-large auth-btn"
            [disabled]="loading() || !registerForm.form.valid">
            @if (loading()) {
              <i class="fas fa-spinner fa-spin"></i>
              Creating Account...
            } @else {
              <i class="fas fa-user-plus"></i>
              Create Account
            }
          </button>

          <div class="auth-footer">
            <p>
              Already have an account?
              <a routerLink="/login" class="auth-link">Sign in here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);

  registerData: RegisterRequest = {
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    company: '',
    website: ''
  };
  
  firstName = '';
  lastName = '';
  confirmPassword = '';
  agreeToTerms = false;

  onSubmit(): void {
    if (this.validateForm()) {
      this.loading.set(true);
      this.errorMessage.set('');

      this.authService.register(this.registerData).subscribe({
        next: (response) => {
          this.loading.set(false);
          if (response.status === 'success') {
            this.router.navigate(['/client']);
          } else {
            this.errorMessage.set(response.message || 'Registration failed. Please try again.');
          }
        },
        error: (error) => {
          this.loading.set(false);
          this.errorMessage.set(
            error.error?.message || 'Registration failed. Please try again.'
          );
        }
      });
    }
  }

  updateFullName(): void {
    this.registerData.name = `${this.firstName} ${this.lastName}`.trim();
  }

  private validateForm(): boolean {
    if (!this.firstName || !this.lastName || 
        !this.registerData.email || !this.registerData.password) {
      this.errorMessage.set('Please fill in all required fields.');
      return false;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return false;
    }

    if (!this.agreeToTerms) {
      this.errorMessage.set('You must agree to the terms and conditions.');
      return false;
    }

    return true;
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }
}