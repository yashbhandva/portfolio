import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapService } from '../../services/gsap.service';

@Component({
  selector: 'app-animated-service-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="animated-services">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Our Services</h2>
          <p class="section-description">
            We offer comprehensive digital solutions to bring your ideas to life
          </p>
        </div>

        <div class="services-grid">
          <div class="service-card" *ngFor="let service of services; let i = index">
            <div class="service-icon">
              <i [class]="service.icon"></i>
            </div>
            <h3 class="service-title">{{ service.title }}</h3>
            <p class="service-description">{{ service.description }}</p>
            <ul class="service-features">
              <li *ngFor="let feature of service.features">
                <i class="fas fa-check"></i>
                {{ feature }}
              </li>
            </ul>
            <div class="service-cta">
              <button class="btn btn-outline" (click)="learnMore(service)">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./animated-service-cards.component.scss']
})
export class AnimatedServiceCardsComponent implements AfterViewInit {
  services = [
    {
      icon: 'fas fa-code',
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies and best practices.',
      features: [
        'Responsive Design',
        'SEO Optimization',
        'Performance Focused',
        'Cross-browser Compatible'
      ]
    },
    {
      icon: 'fas fa-database',
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and database management for modern applications.',
      features: [
        'AWS/Azure/GCP Integration',
        'Auto-scaling Systems',
        'Data Migration',
        '24/7 Monitoring'
      ]
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions to protect your digital assets and data.',
      features: [
        'Vulnerability Assessment',
        'Penetration Testing',
        'Security Audits',
        'Incident Response'
        ]
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Apps',
      description: 'Cross-platform mobile applications for iOS and Android devices.',
      features: [
        'Native Performance',
        'Offline Capability',
        'App Store Deployment',
        'Push Notifications'
      ]
    },
    {
      icon: 'fas fa-palette',
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interfaces that enhance user experience.',
      features: [
        'User Research',
        'Wireframing',
        'Prototyping',
        'Usability Testing'
      ]
    },
    {
      icon: 'fas fa-rocket',
      title: 'Digital Marketing',
      description: 'Comprehensive digital marketing strategies to grow your business.',
      features: [
        'SEO Optimization',
        'Social Media Marketing',
        'Content Strategy',
        'Analytics & Reporting'
      ]
    }
  ];

  constructor(private gsapService: GsapService) {}

  ngAfterViewInit(): void {
    this.gsapService.initScrollAnimations();
  }

  learnMore(service: any): void {
    console.log('Learn more about:', service.title);
  }
}