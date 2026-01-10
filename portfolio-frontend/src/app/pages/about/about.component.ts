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
<h1 class="hero-title">About Me</h1>
<p class="hero-description">
I am a passionate Full Stack Developer who turned coding passion into a successful career.
With over 4 years of experience, I deliver exceptional digital solutions.
</p>
</div>
</div>
</section>

<!-- Team Section - Modified to Single Member -->
<section class="team-section">
<div class="container">
<div class="section-header">
<h2 class="section-title">Founder & Chief Executive Officer</h2>
<p class="section-description">
One passion, one vision - creating amazing digital experiences
</p>
</div>

<!-- Single Team Member Card (Centered) -->
<div class="single-member-container">
<div class="single-member-card">

<!-- Team Member Photo (Larger & Centered) -->
<div class="member-photo-large">
<img [src]="teamMember().photo" [alt]="teamMember().name">
<div class="photo-overlay">
<div class="social-links">
<a [href]="teamMember().socialLinks.facebook" target="_blank" class="social-link">
<i class="fab fa-facebook-f"></i>
</a>
<a [href]="teamMember().socialLinks.twitter" target="_blank" class="social-link">
<i class="fab fa-twitter"></i>
</a>
<a [href]="teamMember().socialLinks.linkedin" target="_blank" class="social-link">
<i class="fab fa-linkedin-in"></i>
</a>
<a [href]="teamMember().socialLinks.instagram" target="_blank" class="social-link">
<i class="fab fa-instagram"></i>
</a>
</div>
</div>
</div>

<!-- Team Member Info -->
<div class="member-info-single">
<h3 class="member-name-large">{{ teamMember().name }}</h3>
              <p class="member-role-single">{{ teamMember().role }}</p>
              <p class="member-bio-single">{{ teamMember().bio }}</p>

              <div class="member-skills-single">
                <span class="skill-tag" *ngFor="let skill of teamMember().skills">
                  {{ skill }}
                </span>
              </div>

              <!-- Additional Info Section -->
              <div class="additional-info">
                <div class="info-item">
                  <i class="fas fa-briefcase"></i>
                  <div>
                    <strong>Experience</strong>
                    <p>4+ Years</p>
                  </div>
                </div>
                <div class="info-item">
                  <i class="fas fa-graduation-cap"></i>
                  <div>
                    <strong>Education</strong>
                    <p>B.Tech Computer Science</p>
                  </div>
                </div>
                <div class="info-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <div>
                    <strong>Location</strong>
                    <p>City, Country</p>
                  </div>
                </div>
                <div class="info-item">
                  <i class="fas fa-language"></i>
                  <div>
                    <strong>Languages</strong>
                    <p>English, Hindi</p>
                  </div>
                </div>
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
          <h2 class="section-title">My Services & Expertise</h2>
          <p class="section-description">
            I excel in delivering top-notch digital solutions with excellent client satisfaction
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
          <h2 class="section-title">What My Clients Say</h2>
          <p class="section-description">
            Don't just take my word for it - hear from my satisfied clients
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
            <h2 class="section-title">Contact Me</h2>
            <p class="location-description">
              Let's discuss your project. I'd love to help bring your ideas to life!
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
                  <p>hello&#64;myportfolio.com</p>
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
          <h2 class="cta-title">Ready to Work With Me?</h2>
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
  teamMember = signal<any>({});  // Changed to single member
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
    // Single team member data - Sirf Yash Bhandva
    this.teamMember.set({
      name: 'Yash Bhandva',
      role: 'Full Stack Developer',
      photo: '/assets/images/projects/anime2.jpg',
      bio: `I lead this company with a simple belief — that great ideas can change the world when combined with discipline, innovation, and purpose. From the very beginning, my focus has been on building a brand that stands for trust, excellence, and customer-first thinking.
            What started as a dream is now evolving into a mission: to create solutions that empower individuals and businesses to achieve more. I see challenges not as obstacles, but as opportunities to grow stronger and think smarter.
            My role as a CEO is not just to guide the company, but to inspire the people behind it. Together, we are building more than just a business — we are shaping a vision that will define the future.`,
      skills: ['java', 'Spring Boot', 'spring security', 'jpa', 'html', 'css', 'mysql', 'postgres', 'Docker', 'Git'],
      socialLinks: {
        facebook: 'https://facebook.com/yash',
        twitter: 'https://twitter.com/yash',
        linkedin: 'https://linkedin.com/in/yash',
        instagram: 'https://www.instagram.com/_y_a_s_h004/?hl=en'
      }
    });

    // Updated stats for individual
    this.companyStats.set([
      { value: 50, label: 'Projects Completed' },
      { value: 25, label: 'Happy Clients' },
      { value: 4, label: 'Years Experience' },
      { value: 98, label: 'Client Satisfaction' },
      { value: 15, label: 'Technologies' },
      { value: 24, label: 'Awards Won' }
    ]);
  }

  private loadServicesData(): void {
    this.servicesWithRatings.set([
      {
        name: 'Web Development',
        icon: 'fas fa-code',
        rating: 4.8,
        description: 'Custom web applications built with modern frameworks like Angular and React.',
        projectsCompleted: 25,
        successRate: 95
      },

       {
         name: 'UI/UX Design',
         icon: 'fas fa-palette',
         rating: 4.7,
         description: 'User-centered design solutions that create intuitive and engaging digital experiences.',
         projectsCompleted: 18,
         successRate: 92
       },

       {
         name: 'E-commerce Solutions',
         icon: 'fas fa-shopping-cart',
         rating: 4.9,
         description: 'Full-featured online stores with secure payment integration and inventory management.',
         projectsCompleted: 31,
         successRate: 97
       },

      {
        name: 'Backend Development',
        icon: 'fas fa-server',
        rating: 4.7,
        description: 'Robust server-side solutions using Spring Boot and Node.js.',
        projectsCompleted: 20,
        successRate: 93
      },
      {
        name: 'Database Design',
        icon: 'fas fa-database',
        rating: 4.6,
        description: 'Efficient database architecture and optimization for performance.',
        projectsCompleted: 15,
        successRate: 96
      },
      {
        name: 'API Development',
        icon: 'fas fa-cogs',
        rating: 4.9,
        description: 'RESTful and GraphQL APIs with comprehensive documentation.',
        projectsCompleted: 30,
        successRate: 98
      }
    ]);
  }

  private loadReviewsData(): void {
    this.clientReviews.set([
      {
        comment: 'Yash delivered an outstanding e-commerce platform that exceeded our expectations. His attention to detail and professionalism was remarkable.',
        rating: 5,
        author: {
          name: 'ghanshyam chaudhari',
          role: 'CEO',
          company: 'FashionHub',
          photo: '/assets/images/projects/ghanshyam.jpg'
        }
      },
      {
        comment: 'Working with Yash was a game-changer for our business. He understood our vision and delivered a web app that our users love.',
        rating: 5,
        author: {
          name: 'mikasa akraman',
          role: 'Founder',
          company: 'TechStart',
          photo: '/assets/images/projects/mikasa akraman.jpg'
        }
      },
      {
        comment: 'Excellent service and support throughout the project. Yash was always available to answer questions and implement changes quickly.',
        rating: 4,
        author: {
          name: 'Anita Desai',
          role: 'Marketing Director',
          company: 'GlobalCorp',
          photo: '/assets/images/projects/hinata.jpg'
        }
      }
    ]);
  }

  private initAnimations(): void {
    // Animation code remains the same
  }
}