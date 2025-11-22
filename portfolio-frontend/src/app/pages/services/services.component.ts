import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="services-container">
      <h1>Our Services</h1>
      <div class="services-list">
        <div class="service-item" *ngFor="let service of services">
          <h3>{{ service.name }}</h3>
          <p>{{ service.description }}</p>
          <p>Price: {{ service.price }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .services-container {
      padding: 20px;
    }
    .service-item {
      border: 1px solid #ccc;
      padding: 15px;
      margin: 10px 0;
      border-radius: 5px;
    }
  `]
})
export class ServicesComponent {
  services = [
    {
      name: 'Web Development',
      description: 'Custom web applications',
      price: 1500
    },
    {
      name: 'Mobile Development',
      description: 'Mobile applications',
      price: 2500
    },
    {
      name: 'UI/UX Design',
      description: 'User interface design',
      price: 1200
    }
  ];
}