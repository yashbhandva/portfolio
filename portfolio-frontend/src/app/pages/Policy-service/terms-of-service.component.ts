import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsService } from '../../services/terms.service';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="terms-of-service-page">
      <header class="page-header">
        <div class="container">
          <h1>Terms of Service</h1>
          <p>Please read these terms carefully before using our services.</p>
          <div class="effective-date">
            <i class="fas fa-file-contract"></i>
            Effective Date: {{ effectiveDate() }}
          </div>
        </div>
      </header>

      <div class="container">
        <div class="terms-content" *ngIf="!loading(); else loadingTemplate">

          <!-- Acceptable Use -->
          <section class="terms-section">
            <div class="section-header">
              <span class="section-badge">Section 1</span>
              <h2>Acceptable Use Policy</h2>
            </div>
            <div class="clauses">
              <div class="clause" *ngFor="let clause of acceptableUse()">
                <div class="clause-number">{{ clause.number }}</div>
                <div class="clause-content">
                  <h3>{{ clause.title }}</h3>
                  <p>{{ clause.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- User Responsibilities -->
          <section class="terms-section">
            <div class="section-header">
              <span class="section-badge">Section 2</span>
              <h2>User Responsibilities</h2>
            </div>
            <div class="responsibilities-list">
              <div class="responsibility-item" *ngFor="let item of userResponsibilities()">
                <div class="responsibility-icon">
                  <i class="fas" [ngClass]="item.icon"></i>
                </div>
                <div class="responsibility-details">
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Payment Terms -->
          <section class="terms-section payment-section">
            <div class="section-header">
              <span class="section-badge">Section 3</span>
              <h2>Payment Terms</h2>
            </div>
            <div class="payment-terms">
              <div class="term-card" *ngFor="let term of paymentTerms()">
                <div class="term-header">
                  <i class="fas" [ngClass]="term.icon"></i>
                  <h3>{{ term.title }}</h3>
                </div>
                <p class="term-description">{{ term.description }}</p>
                <div class="term-meta" *ngIf="term.note">
                  <i class="fas fa-info-circle"></i>
                  <span>{{ term.note }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Termination -->
          <section class="terms-section warning-section">
            <div class="section-header">
              <span class="section-badge">Important</span>
              <h2>Termination Policy</h2>
            </div>
            <div class="termination-content">
              <div class="warning-box">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                  <h3>Account Termination</h3>
                  <p>{{ terminationPolicy().description }}</p>
                </div>
              </div>
              <div class="termination-reasons">
                <h4>Reasons for termination may include:</h4>
                <ul>
                  <li *ngFor="let reason of terminationPolicy().reasons">
                    <i class="fas fa-times-circle"></i>
                    <span>{{ reason }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Agreement -->
          <section class="agreement-section">
            <div class="agreement-box">
              <div class="agreement-header">
                <i class="fas fa-handshake"></i>
                <h2>Agreement</h2>
              </div>
              <p>By using our services, you agree to abide by these terms and conditions.</p>
              <div class="agreement-actions">
                <button class="btn btn-primary" (click)="downloadTerms()">
                  <i class="fas fa-download"></i>
                  Download PDF
                </button>
                <button class="btn btn-secondary" (click)="printTerms()">
                  <i class="fas fa-print"></i>
                  Print Terms
                </button>
              </div>
            </div>
          </section>

        </div>

        <ng-template #loadingTemplate>
          <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading terms of service...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./terms-of-service.component.scss']
})
export class TermsOfServiceComponent implements OnInit {
  private termsService = inject(TermsService);

  effectiveDate = signal<string>('');
  acceptableUse = signal<any[]>([]);
  userResponsibilities = signal<any[]>([]);
  paymentTerms = signal<any[]>([]);
  terminationPolicy = signal<any>({});
  loading = signal(true);

  ngOnInit() {
    this.loadTermsData();
  }

  loadTermsData() {
    this.termsService.getTermsData().subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.effectiveDate.set(response.data.effectiveDate);
          this.acceptableUse.set(response.data.acceptableUse);
          this.userResponsibilities.set(response.data.userResponsibilities);
          this.paymentTerms.set(response.data.paymentTerms);
          this.terminationPolicy.set(response.data.terminationPolicy);
        }
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading terms:', error);
        this.loading.set(false);
      }
    });
  }

  downloadTerms() {
    // Implement PDF download functionality
    console.log('Downloading terms PDF...');
  }

  printTerms() {
    window.print();
  }
}