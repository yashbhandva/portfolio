import { Component, OnInit, signal, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { ProjectSummary } from '../../models/project.model';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="portfolio-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Our Portfolio</h1>
          <p class="hero-description">
            Explore our latest projects and see how we've helped businesses 
            transform their ideas into successful digital solutions.
          </p>
        </div>
      </div>
    </section>

    <!-- Portfolio Filters -->
    <section class="portfolio-filters">
      <div class="container">
        <div class="filters-container">
          <!-- Search Box -->
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search projects..." 
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              class="search-input">
          </div>

          <!-- Category Filter -->
          <div class="filter-group">
            <label class="filter-label">Category:</label>
            <select 
              [(ngModel)]="selectedCategory" 
              (change)="filterProjects()"
              class="filter-select">
              <option value="">All Categories</option>
              <option *ngFor="let category of categories()" [value]="category">
                {{ category }}
              </option>
            </select>
          </div>

          <!-- Technology Filter -->
          <div class="filter-group">
            <label class="filter-label">Technology:</label>
            <select 
              [(ngModel)]="selectedTechnology" 
              (change)="filterProjects()"
              class="filter-select">
              <option value="">All Technologies</option>
              <option *ngFor="let tech of technologies()" [value]="tech">
                {{ tech }}
              </option>
            </select>
          </div>

          <!-- Featured Filter -->
          <div class="filter-group">
            <label class="filter-label">Show:</label>
            <select 
              [(ngModel)]="showFeatured" 
              (change)="filterProjects()"
              class="filter-select">
              <option value="all">All Projects</option>
              <option value="featured">Featured Only</option>
            </select>
          </div>

          <!-- View Toggle -->
          <div class="view-toggle">
            <button 
              class="view-btn" 
              [class.active]="viewMode() === 'grid'"
              (click)="setViewMode('grid')">
              <i class="fas fa-th"></i>
            </button>
            <button 
              class="view-btn" 
              [class.active]="viewMode() === 'list'"
              (click)="setViewMode('list')">
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>

        <!-- Active Filters -->
        @if (hasActiveFilters()) {
          <div class="active-filters">
            <span class="active-filters-label">Active Filters:</span>
            @if (selectedCategory) {
              <span class="filter-tag">
                Category: {{ selectedCategory }}
                <button (click)="removeFilter('category')">×</button>
              </span>
            }
            @if (selectedTechnology) {
              <span class="filter-tag">
                Technology: {{ selectedTechnology }}
                <button (click)="removeFilter('technology')">×</button>
              </span>
            }
            @if (showFeatured === 'featured') {
              <span class="filter-tag">
                Featured Only
                <button (click)="removeFilter('featured')">×</button>
              </span>
            }
            @if (searchTerm) {
              <span class="filter-tag">
                Search: "{{ searchTerm }}"
                <button (click)="removeFilter('search')">×</button>
              </span>
            }
            <button class="clear-all-btn" (click)="clearAllFilters()">
              Clear All
            </button>
          </div>
        }
      </div>
    </section>

    <!-- Portfolio Grid -->
    <section class="portfolio-grid-section">
      <div class="container">
        <!-- Loading State -->
        @if (projectService.loading()) {
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading projects...</p>
          </div>
        }

        <!-- Projects Count -->
        @if (!projectService.loading() && filteredProjects().length > 0) {
          <div class="projects-count">
            Showing {{ filteredProjects().length }} of {{ allProjects().length }} projects
          </div>
        }

        <!-- Grid View -->
        @if (!projectService.loading() && filteredProjects().length > 0 && viewMode() === 'grid') {
          <div class="projects-grid">
            <div class="project-card" *ngFor="let project of filteredProjects()">
              <div class="project-image">
                <img 
                  [src]="project.imageUrl || '/assets/images/projects/default-project.jpg'" 
                  [alt]="project.title">
                <div class="project-overlay">
                  <div class="project-actions">
                    <button class="btn btn-primary" (click)="viewProjectDetails(project)">
                      <i class="fas fa-eye"></i>
                      View Details
                    </button>
                    @if (project.projectUrl) {
                      <a 
                        [href]="project.projectUrl" 
                        target="_blank" 
                        class="btn btn-outline">
                        <i class="fas fa-external-link-alt"></i>
                        Live Demo
                      </a>
                    }
                  </div>
                </div>
                @if (project.featured) {
                  <div class="featured-badge">
                    <i class="fas fa-star"></i>
                    Featured
                  </div>
                }
              </div>

              <div class="project-content">
                <h3 class="project-title">{{ project.title }}</h3>
                <p class="project-description">{{ project.description }}</p>
                
                <div class="project-technologies">
                  <span 
                    class="tech-tag" 
                    *ngFor="let tech of project.technologies.slice(0, 3)">
                    {{ tech }}
                  </span>
                  @if (project.technologies.length > 3) {
                    <span class="tech-tag more-tech">
                      +{{ project.technologies.length - 3 }}
                    </span>
                  }
                </div>

                <div class="project-category">
                  <i class="fas fa-folder"></i>
                  {{ project.category }}
                </div>
              </div>
            </div>
          </div>
        }

        <!-- List View -->
        @if (!projectService.loading() && filteredProjects().length > 0 && viewMode() === 'list') {
          <div class="projects-list">
            <div class="project-list-item" *ngFor="let project of filteredProjects()">
              <div class="list-item-image">
                <img 
                  [src]="project.imageUrl || '/assets/images/projects/default-project.jpg'" 
                  [alt]="project.title">
                @if (project.featured) {
                  <div class="featured-badge">
                    <i class="fas fa-star"></i>
                  </div>
                }
              </div>
              
              <div class="list-item-content">
                <div class="project-header">
                  <h3 class="project-title">{{ project.title }}</h3>
                  <div class="project-links">
                    @if (project.projectUrl) {
                      <a 
                        [href]="project.projectUrl" 
                        target="_blank" 
                        class="project-link">
                        <i class="fas fa-external-link-alt"></i>
                        Live Demo
                      </a>
                    }
                    <button 
                      class="project-link" 
                      (click)="viewProjectDetails(project)">
                      <i class="fas fa-info-circle"></i>
                      Details
                    </button>
                  </div>
                </div>
                
                <p class="project-description">{{ project.description }}</p>
                
                <div class="project-meta">
                  <span class="project-category">
                    <i class="fas fa-folder"></i>
                    {{ project.category }}
                  </span>
                  <div class="project-technologies">
                    <span 
                      class="tech-tag" 
                      *ngFor="let tech of project.technologies">
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- No Results -->
        @if (!projectService.loading() && filteredProjects().length === 0) {
          <div class="no-results">
            <i class="fas fa-search fa-3x"></i>
            <h3>No projects found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button class="btn btn-primary" (click)="clearAllFilters()">
              Clear All Filters
            </button>
          </div>
        }
      </div>
    </section>

    <!-- Categories Overview -->
    <section class="categories-overview">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Project Categories</h2>
          <p class="section-description">
            Browse our work by category to see our expertise in different domains
          </p>
        </div>

        <div class="categories-grid">
          <div class="category-card" 
               *ngFor="let category of categories()"
               (click)="selectCategory(category)"
               [class.active]="selectedCategory === category">
            <div class="category-icon">
              <i [class]="getCategoryIcon(category)"></i>
            </div>
            <h3 class="category-name">{{ category }}</h3>
            <p class="category-count">
              {{ getProjectsCountByCategory(category) }} projects
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="portfolio-cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Start Your Project?</h2>
          <p class="cta-description">
            Let's work together to bring your ideas to life with our expertise and creativity.
          </p>
          <div class="cta-buttons">
            <a routerLink="/contact" class="btn btn-primary btn-large">
              Start Your Project
            </a>
            <a routerLink="/services" class="btn btn-outline btn-large">
              View Our Services
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Project Details Modal -->
    @if (selectedProject()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="closeModal()">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="project-details">
            <div class="details-header">
              <div class="project-gallery">
                <img 
                  [src]="selectedProject()?.imageUrl || '/assets/images/projects/default-project.jpg'" 
                  [alt]="selectedProject()?.title"
                  class="main-image">
              </div>
              
              <div class="details-main">
                <div class="project-badge" [class.featured]="selectedProject()?.featured">
                  @if (selectedProject()?.featured) {
                    <i class="fas fa-star"></i>
                    Featured Project
                  } @else {
                    <i class="fas fa-rocket"></i>
                    {{ selectedProject()?.category }}
                  }
                </div>
                
                <h1 class="project-title">{{ selectedProject()?.title }}</h1>
                <p class="project-description">{{ selectedProject()?.description }}</p>
                
                <div class="project-links">
                  @if (selectedProject()?.projectUrl) {
                    <a 
                      [href]="selectedProject()?.projectUrl" 
                      target="_blank" 
                      class="btn btn-primary">
                      <i class="fas fa-external-link-alt"></i>
                      Live Demo
                    </a>
                  }
                  <a 
                    routerLink="/contact" 
                    [queryParams]="{ project: selectedProject()?.title }"
                    class="btn btn-outline">
                    <i class="fas fa-envelope"></i>
                    Get Quote
                  </a>
                </div>
              </div>
            </div>

            <div class="details-content">
              <div class="details-section">
                <h3>Project Overview</h3>
                <p class="project-full-description">
                  {{ getFullDescription() }}
                </p>
              </div>

              <div class="details-section">
                <h3>Technologies Used</h3>
                <div class="technologies-grid">
                  <div class="technology-item" *ngFor="let tech of selectedProject()?.technologies">
                    <i class="fas fa-code"></i>
                    <span>{{ tech }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit, AfterViewInit {
  projectService = inject(ProjectService);
  
  // Signals
  allProjects = signal<ProjectSummary[]>([]);
  filteredProjects = signal<ProjectSummary[]>([]);
  categories = signal<string[]>([]);
  technologies = signal<string[]>([]);
  selectedProject = signal<ProjectSummary | null>(null);
  viewMode = signal<'grid' | 'list'>('grid');

  // Filter properties
  searchTerm = '';
  selectedCategory = '';
  selectedTechnology = '';
  showFeatured = 'all';

  ngOnInit() {
    this.loadProjects();
    this.loadCategories();
  }

  ngAfterViewInit() {
    // Initialize any animations
  }

  private loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        if (response.success) {
          this.allProjects.set(response.data);
          this.filteredProjects.set(response.data);
          this.extractTechnologies();
        }
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loadSampleProjects();
      }
    });
  }

  private loadCategories(): void {
    this.projectService.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.extractCategories();
      }
    });
  }

  private extractTechnologies(): void {
    const allTech = new Set<string>();
    this.allProjects().forEach(project => {
      project.technologies.forEach(tech => allTech.add(tech));
    });
    this.technologies.set(Array.from(allTech));
  }

  private extractCategories(): void {
    const categories = [...new Set(this.allProjects().map(p => p.category))];
    this.categories.set(categories);
  }

  private loadSampleProjects(): void {
    const sampleProjects: ProjectSummary[] = [
      {
        id: 1,
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with payment integration and admin dashboard.',
        category: 'Web Development',
        imageUrl: '/assets/images/projects/E-Commerce Platform.jpg',
        projectUrl: 'https://demo-ecommerce.com',
        featured: true,
        technologies: ['Angular', 'Spring Boot', 'MySQL', 'Stripe', 'AWS']
      },
      {
        id: 2,
        title: 'Task Management App',
        description: 'Productivity app for team collaboration and task tracking with real-time updates.',
        category: 'Mobile Development',
        imageUrl: '/assets/images/projects/Task Management App.jpg',
        projectUrl: 'https://demo-taskapp.com',
        featured: true,
        technologies: ['React Native', 'Node.js', 'MongoDB', 'Socket.io']
      },
      {
        id: 3,
        title: 'Portfolio Website',
        description: 'Modern portfolio website with animations and content management system.',
        category: 'Web Development',
        imageUrl: '/assets/images/projects/Portfolio Website.jpg',
        projectUrl: 'https://demo-portfolio.com',
        featured: false,
        technologies: ['Angular', 'Three.js', 'GSAP', 'SCSS']
      },
      {
        id: 4,
        title: 'Social Media Dashboard',
        description: 'Analytics dashboard for social media management and performance tracking.',
        category: 'Web Development',
        imageUrl: '/assets/images/projects/dashboard.jpg',
        featured: false,
        technologies: ['Vue.js', 'Express.js', 'PostgreSQL', 'Chart.js']
      },
      {
        id: 5,
        title: 'Fitness Tracking App',
        description: 'Mobile app for workout tracking, progress monitoring, and fitness plans.',
        category: 'Mobile Development',
        imageUrl: '/assets/images/projects/fitness.jpg',
        featured: true,
        technologies: ['Flutter', 'Firebase', 'Google Fit API']
      },
      {
        id: 6,
        title: 'Restaurant Booking System',
        description: 'Online reservation system for restaurants with table management.',
        category: 'Web Development',
        imageUrl: '/assets/images/projects/restaurant.jpg',
        projectUrl: 'https://demo-restaurant.com',
        featured: false,
        technologies: ['React', 'Python', 'Django', 'SQLite']
      }
    ];

    this.allProjects.set(sampleProjects);
    this.filteredProjects.set(sampleProjects);
    this.extractTechnologies();
    this.extractCategories();
  }

  // Filtering methods
  onSearch(): void {
    this.filterProjects();
  }

  filterProjects(): void {
    let filtered = this.allProjects();

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.technologies.some(tech => 
          tech.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(project => 
        project.category === this.selectedCategory
      );
    }

    // Apply technology filter
    if (this.selectedTechnology) {
      filtered = filtered.filter(project => 
        project.technologies.includes(this.selectedTechnology)
      );
    }

    // Apply featured filter
    if (this.showFeatured === 'featured') {
      filtered = filtered.filter(project => project.featured);
    }

    this.filteredProjects.set(filtered);
  }

  // View mode methods
  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }

  // Category methods
  selectCategory(category: string): void {
    this.selectedCategory = this.selectedCategory === category ? '' : category;
    this.filterProjects();
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Web Development': 'fas fa-code',
      'Mobile Development': 'fas fa-mobile-alt',
      'UI/UX Design': 'fas fa-palette',
      'E-commerce': 'fas fa-shopping-cart',
      'Dashboard': 'fas fa-chart-line'
    };
    return icons[category] || 'fas fa-cube';
  }

  getProjectsCountByCategory(category: string): number {
    return this.allProjects().filter(project => project.category === category).length;
  }

  // Filter management
  hasActiveFilters(): boolean {
    return !!(this.selectedCategory || this.selectedTechnology || 
             this.showFeatured === 'featured' || this.searchTerm);
  }

  removeFilter(filterType: string): void {
    switch (filterType) {
      case 'category':
        this.selectedCategory = '';
        break;
      case 'technology':
        this.selectedTechnology = '';
        break;
      case 'featured':
        this.showFeatured = 'all';
        break;
      case 'search':
        this.searchTerm = '';
        break;
    }
    this.filterProjects();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedTechnology = '';
    this.showFeatured = 'all';
    this.filteredProjects.set(this.allProjects());
  }

  // Project details methods
  viewProjectDetails(project: ProjectSummary): void {
    this.selectedProject.set(project);
  }

  closeModal(): void {
    this.selectedProject.set(null);
  }

  getFullDescription(): string {
    const project = this.selectedProject();
    if (!project) return '';
    
    // In real implementation, this would come from project.fullDescription
    return `This project demonstrates our expertise in ${project.category.toLowerCase()}. 
            We utilized modern technologies including ${project.technologies.slice(0, 3).join(', ')} 
            to deliver a robust and scalable solution that meets client requirements. 
            The project showcases our commitment to quality code, user experience, and timely delivery.`;
  }
}