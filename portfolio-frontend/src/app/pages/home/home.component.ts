import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThreeHeroComponent } from '../../components/three-hero/three-hero.component';
import { AnimatedServiceCardsComponent } from '../../components/animated-service-cards/animated-service-cards.component';
import { GsapService } from '../../services/gsap.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ThreeHeroComponent, AnimatedServiceCardsComponent],
  template: `
    <!-- Three.js Hero Section -->
    <app-three-hero></app-three-hero>

    <!-- Animated Services Section -->
    <app-animated-service-cards></app-animated-service-cards>

    <!-- Featured Projects Section -->
    <section id="projects" class="projects-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Featured Projects</h2>
          <p class="section-description">
            Check out some of our recent work that we're proud of
          </p>
        </div>

        <div class="projects-grid">
          <div class="project-card" *ngFor="let project of featuredProjects; let i = index">
            <div class="project-image">
              <img [src]="project.image" [alt]="project.title">
              <div class="project-overlay">
                <div class="project-actions">
                  <button class="btn btn-primary" (click)="viewProject(project)">
                    <i class="fas fa-eye"></i>
                    View Details
                  </button>
                  <a [href]="project.liveUrl" target="_blank" class="btn btn-outline" *ngIf="project.liveUrl">
                    <i class="fas fa-external-link-alt"></i>
                    Live Demo
                  </a>
                </div>
              </div>
            </div>

            <div class="project-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>

              <div class="project-technologies">
                <span class="tech-tag" *ngFor="let tech of project.technologies">
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="section-cta">
          <a routerLink="/portfolio" class="btn btn-primary btn-large">
            View All Projects
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- Animated Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item" *ngFor="let stat of stats">
            <div class="stat-icon">
              <i [class]="stat.icon"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Start Your Project?</h2>
          <p class="cta-description">
            Let's discuss your ideas and create something amazing together
          </p>
          <a routerLink="/contact" class="btn btn-primary btn-large">
            Get Free Consultation
          </a>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  featuredProjects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration and admin dashboard.',
      image: '/assets/images/projects/E-Commerce Platform.jpg',
      technologies: ['Angular', 'Spring Boot', 'MySQL', 'Stripe'],
      liveUrl: 'https://demo-ecommerce.com'
    },
    {
      title: 'Task Management App',
      description: 'Productivity app for team collaboration and task tracking with real-time updates.',
      image: '/assets/images/projects/Task Management App.jpg',
      technologies: ['React Native', 'Node.js', 'MongoDB', 'Socket.io'],
      liveUrl: 'https://demo-taskapp.com'
    },
    {
      title: 'Portfolio Website',
      description: 'Modern portfolio website with animations and content management system.',
      image: '/assets/images/projects/Portfolio Website.jpg',
      technologies: ['Angular', 'Three.js', 'GSAP', 'SCSS'],
      liveUrl: 'https://demo-portfolio.com'
    }
  ];

  stats = [
    { icon: 'fas fa-project-diagram', value: "10", label: 'Projects Completed' },
    { icon: 'fas fa-users', value: 25, label: 'Happy Clients' },
    { icon: 'fas fa-code-branch', value: 3, label: 'Team Members' },
    { icon: 'fas fa-award', value: 5, label: 'Years Experience' }
  ];

  constructor(private gsapService: GsapService) {}

  ngAfterViewInit(): void {
    this.gsapService.initScrollAnimations();
  }

  viewProject(project: any): void {
    console.log('View project:', project.title);
  }
}