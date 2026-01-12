import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Hero Section -->
              <section class="portfolio-hero">
                <div class="container">
                  <div class="hero-content">
                    <h1>My Profile Settings</h1>
                    <p class="hero-description">
                      View and manage your account information
                    </p>
                  </div>
                </div>
              </section>

    <div class="profile-container">
      <div class="page-header">

      </div>

      <div class="profile-content">
        <div class="profile-card">
          <div class="profile-header">
            <div class="avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="user-info">
              <h2>{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</h2>
              <p>{{ authService.currentUser()?.email }}</p>
            </div>
          </div>

          <form class="profile-form" (ngSubmit)="updateProfile()" #profileForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName" class="form-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  [(ngModel)]="profileData.firstName"
                  required
                  class="form-input">
              </div>

              <div class="form-group">
                <label for="lastName" class="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  [(ngModel)]="profileData.lastName"
                  required
                  class="form-input">
              </div>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="profileData.email"
                required
                class="form-input">
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                [(ngModel)]="profileData.phone"
                class="form-input">
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="loading()">
                @if (loading()) {
                  <i class="fas fa-spinner fa-spin"></i>
                  Updating...
                } @else {
                  <i class="fas fa-save"></i>
                  Update Profile
                }
              </button>
            </div>
          </form>
        </div>

        <div class="security-card">
          <h3>Security Settings</h3>
          <div class="security-item">
            <div class="security-info">
              <h4>Password</h4>
              <p>Last updated 3 months ago</p>
            </div>
            <button class="btn btn-outline btn-sm" (click)="changePassword()">
              Change Password
            </button>
          </div>
          
          <div class="security-item">
            <div class="security-info">
              <h4>Two-Factor Authentication</h4>
              <p>Add an extra layer of security</p>
            </div>
            <button class="btn btn-outline btn-sm" (click)="setup2FA()">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  loading = signal(false);

  profileData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };

  ngOnInit() {
    this.loadProfile();
  }

  private loadProfile(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profileData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || ''
      };
    }
  }

  updateProfile(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      console.log('Profile updated:', this.profileData);
    }, 2000);
  }

  changePassword(): void {
    console.log('Change password');
  }

  setup2FA(): void {
    console.log('Setup 2FA');
  }
}