import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapService } from '../../services/gsap.service';

@Component({
  selector: 'app-three-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="three-hero">
      <div class="hero-content">
        <div class="container">
          <div class="hero-text">
            <h1 class="hero-title">
              Create 
              <span class="text-gradient">Amazing</span>
              Digital Experiences
            </h1>
            <p class="hero-description">
              We transform your ideas into stunning digital solutions with cutting-edge 
              technology and creative design. Let's build something extraordinary together.
            </p>
            <div class="hero-buttons">
              <button class="btn btn-primary" (click)="scrollToProjects()">
                <i class="fas fa-rocket"></i>
                View Our Work
              </button>
            </div>
          </div>
          
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number" countUp="50">0</div>
              <div class="stat-label">Projects Delivered</div>
            </div>
            <div class="stat-item">
              <div class="stat-number" countUp="98">0</div>
              <div class="stat-label">Client Satisfaction</div>
            </div>
            <div class="stat-item">
              <div class="stat-number" countUp="5">0</div>
              <div class="stat-label">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      <div class="scroll-indicator">
        <div class="scroll-text">Scroll to explore</div>
        <div class="scroll-arrow">
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./three-hero.component.scss']
})
export class ThreeHeroComponent implements AfterViewInit, OnDestroy {

  constructor(private gsapService: GsapService) {}

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  ngOnDestroy(): void {
    this.gsapService.destroy();
  }

  private initAnimations(): void {
    this.gsapService.animateHeroSection();
    
    setTimeout(() => {
      this.gsapService.initButtonAnimations();
    }, 1000);
  }

  scrollToProjects(): void {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}