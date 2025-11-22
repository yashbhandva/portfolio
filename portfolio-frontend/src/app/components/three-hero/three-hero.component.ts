import { Component, OnDestroy, ElementRef, ViewChild, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeService } from '../../services/three.service';
import { GsapService } from '../../services/gsap.service';

@Component({
  selector: 'app-three-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="three-hero">
      <div #threeContainer class="three-container"></div>
      
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
              <button class="btn btn-secondary" (click)="toggleAnimation()">
                <i class="fas" [class.fa-play]="!animationRunning()" [class.fa-pause]="animationRunning()"></i>
                {{ animationRunning() ? 'Pause' : 'Play' }} Animation
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
  @ViewChild('threeContainer') threeContainer!: ElementRef;

  animationRunning = signal(true);

  constructor(
    private threeService: ThreeService,
    private gsapService: GsapService
  ) {}

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.initAnimations();
  }

  ngOnDestroy(): void {
    this.threeService.dispose();
    this.gsapService.destroy();
  }

  private initThreeJS(): void {
    if (this.threeContainer) {
      this.threeService.init(this.threeContainer.nativeElement);
    }
  }

  private initAnimations(): void {
    this.gsapService.animateHeroSection();
    
    setTimeout(() => {
      this.gsapService.initButtonAnimations();
    }, 1000);
  }

  toggleAnimation(): void {
    this.threeService.toggleAnimation();
    this.animationRunning.set(this.threeService.animationRunning());
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