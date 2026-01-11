import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyService } from '../../services/privacy.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="privacy-policy-page">
      <header class="page-header">
        <div class="container">
          <h1>Privacy Policy</h1>
          <p>Your privacy is important to us. Read how we collect, use, and protect your information.</p>
          <div class="last-updated">
            <i class="fas fa-calendar-alt"></i>
            Last Updated: {{ lastUpdated() }}
          </div>
        </div>
      </header>

      <div class="container">
        <div class="content-section" *ngIf="!loading(); else loadingTemplate">

          <!-- Introduction -->
          <section class="policy-section">
            <div class="section-header">
              <span class="section-badge">Introduction</span>
              <h2>Welcome to Our Privacy Policy</h2>
            </div>
            <p class="section-description">
              This Privacy Policy describes how we collect, use, and handle your personal information when you use our services.
            </p>
          </section>

          <!-- Information We Collect -->
          <section class="policy-section">
            <div class="section-header">
              <span class="section-badge">Data Collection</span>
              <h2>Information We Collect</h2>
            </div>
            <div class="features-list">
              <div class="feature-item" *ngFor="let item of dataCollection()">
                <i class="fas" [ngClass]="item.icon"></i>
                <div>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- How We Use Information -->
          <section class="policy-section">
            <div class="section-header">
              <span class="section-badge">Usage</span>
              <h2>How We Use Your Information</h2>
            </div>
            <ul class="usage-list">
              <li *ngFor="let use of dataUsage()">
                <i class="fas fa-check-circle"></i>
                <span>{{ use }}</span>
              </li>
            </ul>
          </section>

          <!-- Data Protection -->
          <section class="policy-section">
            <div class="section-header">
              <span class="section-badge">Security</span>
              <h2>Data Protection</h2>
            </div>
            <p class="section-description">
              We implement industry-standard security measures to protect your data from unauthorized access.
            </p>
            <div class="security-features">
              <div class="security-item" *ngFor="let feature of securityFeatures()">
                <div class="security-icon">
                  <i class="fas" [ngClass]="feature.icon"></i>
                </div>
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </div>
            </div>
          </section>

          <!-- Contact -->
          <section class="policy-section contact-section">
            <div class="section-header">
              <span class="section-badge">Contact</span>
              <h2>Contact Us</h2>
            </div>
            <p class="section-description">
              For privacy-related questions, contact our Data Protection Officer at:
            </p>
            <div class="contact-info">
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <span>privacy_officer&#64;example.com</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-phone"></i>
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </section>

        </div>

        <ng-template #loadingTemplate>
          <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading privacy policy...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  private privacyService = inject(PrivacyService);

  lastUpdated = signal<string>('');
  dataCollection = signal<any[]>([]);
  dataUsage = signal<string[]>([]);
  securityFeatures = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadPrivacyData();
  }

  loadPrivacyData() {
    this.privacyService.getPrivacyData().subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.lastUpdated.set(response.data.lastUpdated);
          this.dataCollection.set(response.data.dataCollection);
          this.dataUsage.set(response.data.dataUsage);
          this.securityFeatures.set(response.data.securityFeatures);
        }
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading privacy policy:', error);
        this.loading.set(false);
      }
    });
  }
}