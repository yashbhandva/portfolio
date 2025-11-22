import { Component, OnInit, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="about-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">About Our Team</h1>
          <p class="hero-description">
            We are three passionate friends who turned our coding passion into a successful business. 
            With combined experience of over 10 years, we deliver exceptional digital solutions.
          </p>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Meet Our Team</h2>
          <p class="section-description">
            Three friends, one vision - creating amazing digital experiences
          </p>
        </div>
        
        <div class="team-grid">
          <div class="team-card" *ngFor="let member of teamMembers()" 
               [class.active]="activeMember() === member.id"
               (mouseenter)="setActiveMember(member.id)"
               (mouseleave)="clearActiveMember()">
            
            <!-- Team Member Photo -->
            <div class="member-photo">
              <img [src]="member.photo" [alt]="member.name">
              <div class="photo-overlay">
                <div class="social-links">
                  <a [href]="member.socialLinks.facebook" target="_blank" class="social-link">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a [href]="member.socialLinks.twitter" target="_blank" class="social-link">
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a [href]="member.socialLinks.linkedin" target="_blank" class="social-link">
                    <i class="fab fa-linkedin-in"></i>
                  </a>
                  <a [href]="member.socialLinks.instagram" target="_blank" class="social-link">
                    <i class="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>

            <!-- Team Member Info -->
            <div class="member-info">
              <h3 class="member-name">{{ member.name }}</h3>
              <p class="member-role">{{ member.role }}</p>
              <p class="member-bio">{{ member.bio }}</p>
              
              <div class="member-skills">
                <span class="skill-tag" *ngFor="let skill of member.skills">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item" *ngFor="let stat of companyStats()">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Overview -->
    <section class="services-overview">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Our Services & Ratings</h2>
          <p class="section-description">
            We excel in delivering top-notch digital solutions with excellent client satisfaction
          </p>
        </div>

        <div class="services-ratings">
          <div class="rating-card" *ngFor="let service of servicesWithRatings()">
            <div class="service-header">
              <div class="service-icon">
                <i [class]="service.icon"></i>
              </div>
              <div class="service-info">
                <h3 class="service-name">{{ service.name }}</h3>
                <div class="rating">
                  <div class="stars">
                    <i class="fas fa-star" *ngFor="let star of [1,2,3,4,5]"
                       [class.active]="star <= service.rating"></i>
                  </div>
                  <span class="rating-value">{{ service.rating }}/5</span>
                </div>
              </div>
            </div>
            <p class="service-description">{{ service.description }}</p>
            <div class="service-stats">
              <div class="stat">
                <span class="stat-number">{{ service.projectsCompleted }}+</span>
                <span class="stat-label">Projects</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ service.successRate }}%</span>
                <span class="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Client Reviews -->
    <section class="reviews-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">What Our Clients Say</h2>
          <p class="section-description">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </div>

        <div class="reviews-grid">
          <div class="review-card" *ngFor="let review of clientReviews()">
            <div class="review-content">
              <div class="quote-icon">"</div>
              <p class="review-text">{{ review.comment }}</p>
            </div>
            <div class="review-author">
              <img [src]="review.author.photo" [alt]="review.author.name" class="author-photo">
              <div class="author-info">
                <h4 class="author-name">{{ review.author.name }}</h4>
                <p class="author-role">{{ review.author.role }} at {{ review.author.company }}</p>
                <div class="review-rating">
                  <i class="fas fa-star" *ngFor="let star of [1,2,3,4,5]"
                     [class.active]="star <= review.rating"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Location Map -->
    <section class="location-section">
      <div class="container">
        <div class="location-content">
          <div class="location-info">
            <h2 class="section-title">Visit Our Office</h2>
            <p class="location-description">
              Come meet us at our office. We'd love to discuss your project over a cup of coffee!
            </p>
            
            <div class="contact-details">
              <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Address</strong>
                  <p>123 Tech Street, Innovation District<br>City, State 12345</p>
                </div>
              </div>
              
              <div class="contact-item">
                <i class="fas fa-phone"></i>
                <div>
                  <strong>Phone</strong>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <div>
                  <strong>Email</strong>
                  <p>hello&#64;ourportfolio.com</p>
                </div>
              </div>
              
              <div class="contact-item">
                <i class="fas fa-clock"></i>
                <div>
                  <strong>Working Hours</strong>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div class="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.6339866!2d70.9035796!3d23.6339866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395a5f472df66221%3A0x601ed0a582e55960!2sModa%20Gujarat%20Kutch!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
              width="100%" 
              height="400" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="about-cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Work With Us?</h2>
          <p class="cta-description">
            Let's discuss your project and bring your ideas to life
          </p>
          <a routerLink="/contact" class="btn btn-primary btn-large">
            Start Your Project
          </a>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit {
  teamMembers = signal<any[]>([]);
  activeMember = signal<number | null>(null);
  companyStats = signal<any[]>([]);
  servicesWithRatings = signal<any[]>([]);
  clientReviews = signal<any[]>([]);

  ngOnInit() {
    this.loadTeamData();
    this.loadServicesData();
    this.loadReviewsData();
  }

  ngAfterViewInit() {
    this.initAnimations();
  }

  private loadTeamData(): void {
    // Team members data - 3 dosto ke liye
    this.teamMembers.set([
      {
        id: 1,
        name: 'yash bhandva',
        role: 'Full Stack Developer',
        photo: '/assets/images/projects/anime2.jpg',
        bio: 'Specialized in Angular and Spring Boot with 4+ years of experience. Loves solving complex problems and building scalable applications.',
        skills: ['Angular', 'Spring Boot', 'Node.js', 'MySQL', 'AWS'],
        socialLinks: {
          facebook: 'https://facebook.com/raj',
          twitter: 'https://twitter.com/raj',
          linkedin: 'https://linkedin.com/in/raj',
          instagram: 'https://www.instagram.com/_y_a_s_h004/?hl=en'
        }
      },
      {
        id: 2,
        name: 'bhautik chopra',
        role: 'UI/UX Designer & Frontend Developer',
        photo: '/assets/images/projects/bhautik.jpg.jpg',
        bio: 'Creative designer with 3+ years of experience in creating beautiful and functional user interfaces. Passionate about animations and user experience.',
        skills: ['Figma', 'Adobe XD', 'React', 'GSAP', 'Three.js'],
        socialLinks: {
          facebook: 'https://facebook.com/amit',
          twitter: 'https://twitter.com/amit',
          linkedin: 'https://linkedin.com/in/amit',
          instagram: 'https://www.instagram.com/bhautik_chopda_9/?hl=enhttps://instagram.com/amit'
        }
      },
      {
        id: 3,
        name: 'jay',
        role: 'Mobile App Developer & DevOps',
        photo: '/assets/images/projects/jay.jpg.jpg',
        bio: 'Expert in mobile app development and cloud infrastructure. Enjoys building cross-platform apps and optimizing deployment pipelines.',
        skills: ['Flutter', 'React Native', 'Docker', 'Kubernetes', 'Firebase'],
        socialLinks: {
          facebook: 'https://facebook.com/vikram',
          twitter: 'https://twitter.com/vikram',
          linkedin: 'https://linkedin.com/in/vikram',
          instagram: 'https://www.instagram.com/jay._.47._.10/?hl=en'
        }
      }
    ]);

    this.companyStats.set([
      { value: 50, label: 'Projects Completed' },
      { value: 25, label: 'Happy Clients' },
      { value: 3, label: 'Team Members' },
      { value: 5, label: 'Years Experience' },
      { value: 98, label: 'Client Satisfaction' },
      { value: 24, label: 'Awards Won' }
    ]);
  }

  private loadServicesData(): void {
    this.servicesWithRatings.set([
      {
        name: 'Web Development',
        icon: 'fas fa-code',
        rating: 4.8,
        description: 'Custom web applications built with modern frameworks and best practices.',
        projectsCompleted: 25,
        successRate: 95
      },
      {
        name: 'Mobile App Development',
        icon: 'fas fa-mobile-alt',
        rating: 4.7,
        description: 'Cross-platform mobile applications for iOS and Android devices.',
        projectsCompleted: 15,
        successRate: 92
      },
      {
        name: 'UI/UX Design',
        icon: 'fas fa-palette',
        rating: 4.9,
        description: 'Beautiful and intuitive user interfaces that enhance user experience.',
        projectsCompleted: 30,
        successRate: 98
      },
      {
        name: 'Digital Marketing',
        icon: 'fas fa-chart-line',
        rating: 4.6,
        description: 'Comprehensive digital marketing strategies to grow your business online.',
        projectsCompleted: 20,
        successRate: 90
      }
    ]);
  }

  private loadReviewsData(): void {
    this.clientReviews.set([
      {
        comment: 'The team delivered an outstanding e-commerce platform that exceeded our expectations. Their attention to detail and professionalism was remarkable.',
        rating: 5,
        author: {
          name: 'Priya Mehta',
          role: 'CEO',
          company: 'FashionHub',
          photo: '/assets/images/clients/priya.jpg'
        }
      },
      {
        comment: 'Working with these guys was a game-changer for our business. They understood our vision and delivered a mobile app that our users love.',
        rating: 5,
        author: {
          name: 'Rohan Verma',
          role: 'Founder',
          company: 'TechStart',
          photo: '/assets/images/clients/rohan.jpg'
        }
      },
      {
        comment: 'Excellent service and support throughout the project. They were always available to answer questions and implement changes quickly.',
        rating: 4,
        author: {
          name: 'Anita Desai',
          role: 'Marketing Director',
          company: 'GlobalCorp',
          photo: '/assets/images/clients/anita.jpg'
        }
      }
    ]);
  }

  setActiveMember(memberId: number): void {
    this.activeMember.set(memberId);
  }

  clearActiveMember(): void {
    this.activeMember.set(null);
  }

  private initAnimations(): void {
    // GSAP animations will be implemented here
    // For now, we'll add basic CSS animations
  }
}