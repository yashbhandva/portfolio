import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-payments',
  standalone: true,
  imports: [CommonModule],
  template: `
  <!-- Hero Section -->
            <section class="portfolio-hero">
              <div class="container">
                <div class="hero-content">
                  <h1>My Payments</h1>
                  <p class="hero-description">
                    View your payment history here
                  </p>
                </div>
              </div>
            </section>
    <div class="client-payments">

    </div>
  `,
  styleUrls: ['./payments.component.scss']
})
export class ClientPaymentsComponent {
}