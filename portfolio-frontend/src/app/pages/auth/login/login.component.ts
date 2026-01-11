import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
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
          <h1 class="auth-title">Welcome Back</h1>
          <p class="auth-subtitle">Sign in to your account to continue</p>
        </div>

        <form class="auth-form" (ngSubmit)="onSubmit()" #loginForm="ngForm">
          @if (errorMessage()) {
            <div class="alert alert-error">
              <i class="fas fa-exclamation-circle"></i>
              {{ errorMessage() }}
            </div>
          }

          <div class="form-group">
            <label for="email" class="form-label">
              <i class="fas fa-envelope"></i>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="loginData.email"
              required
              email
              class="form-input"
              placeholder="Enter your email address">
          </div>

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
                [(ngModel)]="loginData.password"
                required
                minlength="6"
                class="form-input"
                placeholder="Enter your password">
              <button
                type="button"
                class="password-toggle"
                (click)="togglePasswordVisibility()">
                <i [class]="showPassword() ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input
                type="checkbox"
                [(ngModel)]="rememberMe"
                name="rememberMe"
                class="checkbox-input">
              <span class="checkmark"></span>
              Remember me
            </label>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-large auth-btn"
            [disabled]="loading() || !loginForm.form.valid">
            @if (loading()) {
              <i class="fas fa-spinner fa-spin"></i>
              Signing In...
            } @else {
              <i class="fas fa-sign-in-alt"></i>
              Sign In
            }
          </button>

          <div class="auth-footer">
            <p>
              Don't have an account?
              <a routerLink="/register" class="auth-link">Create one here</a>
            </p>
          </div>
        </form>
      </div>

    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  showPassword = signal<boolean>(false);
  showDemoCredentials = signal<boolean>(false);

  loginData: LoginRequest = {
    email: '',
    password: ''
  };
  rememberMe = false;
  returnUrl = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });

    if (this.authService.isAuthenticated()) {
      this.redirectUser();
    }
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.loading.set(true);
      this.errorMessage.set('');

      this.authService.login(this.loginData).subscribe({
        next: (response) => {
          this.loading.set(false);
          if (response.status === 'success') {
            this.redirectUser();
          } else {
            this.errorMessage.set(response.message || 'Login failed. Please try again.');
          }
        },
        error: (error) => {
          this.loading.set(false);
          this.errorMessage.set(
            error.error?.message || 'Login failed. Please check your credentials and try again.'
          );
        }
      });
    }
  }

  private validateForm(): boolean {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage.set('Please fill in all required fields.');
      return false;
    }
    return true;
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleDemoCredentials(): void {
    this.showDemoCredentials.set(!this.showDemoCredentials());
  }

  private redirectUser(): void {
    const user = this.authService.currentUser();
    if (user) {
      if (this.returnUrl && this.returnUrl !== '/') {
        this.router.navigateByUrl(this.returnUrl);
      } else if (user.role === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/client']);
      }
    }
  }
}