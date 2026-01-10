import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="services-page">
      <header class="page-header">
        <div class="container">
          <h1>Our Services</h1>
          <p>Professional solutions tailored to your business needs</p>
        </div>
      </header>

      <div class="container">
        <div class="services-grid" *ngIf="!loading(); else loadingTemplate">
          <div class="service-card" *ngFor="let service of services()">
            <div class="card-header">
              <span class="category-badge">{{ service.category }}</span>
              <h3>{{ service.name }}</h3>
            </div>

            <div class="price-tag">
              <span class="currency">$</span>
              <span class="amount">{{ service.startingPrice }}</span>
              <span class="period">/ starting</span>
            </div>

            <p class="description">{{ service.description }}</p>

            <div class="features-list" *ngIf="service.features">
              <div class="feature-item" *ngFor="let feature of service.features.split(',')">
                <i class="fas fa-check"></i>
                <span>{{ feature.trim() }}</span>
              </div>
            </div>

            <div class="card-footer">
              <div class="delivery-time">
                <i class="fas fa-clock"></i>
                <span>{{ service.deliveryDays }} Days Delivery</span>
              </div>
              <button class="btn btn-primary btn-block" (click)="buyService(service)">
                Get Started
              </button>
            </div>
          </div>
        </div>

        <ng-template #loadingTemplate>
          <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading services...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  private serviceService = inject(ServiceService);
  private router = inject(Router);
  private authService = inject(AuthService);

  services = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.serviceService.getActiveServices().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.services.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.loading.set(false);
      }
    });
  }

  buyService(service: any) {
    // Navigate to contact page with service pre-selected
    this.router.navigate(['/contact'], {
      queryParams: {
        service: service.name,
        serviceId: service.id
      }
    });
  }
}