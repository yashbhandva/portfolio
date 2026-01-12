import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule],
  template: `
  <!-- Hero Section -->
          <section class="portfolio-hero">
            <div class="container">
              <div class="hero-content">
                <h1 class="hero-title">Payments Management</h1>
                <p class="hero-description">
                 Manage payments here.
                </p>
              </div>
            </div>
          </section>
    <div class="admin-payments">
    </div>
  `,
  styleUrls: ['./payments.component.scss']
})
export class AdminPaymentsComponent {
}