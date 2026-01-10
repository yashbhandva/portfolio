import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header" [class.scrolled]="isScrolled()">
      <nav class="nav-container">
        <!-- Logo -->
        <div class="logo">
          <a routerLink="/" class="logo-link">
            <img src="assets/images/projects/yash.png" alt="Portfolio Logo" class="logo-image">
          </a>
        </div>

        <!-- Desktop Navigation -->
        <ul class="nav-menu" [class.active]="isMenuOpen()">
          <li class="nav-item">
            <a routerLink="/" routerLinkActive="active" class="nav-link">Home</a>
          </li>
          <li class="nav-item">
            <a routerLink="/about" routerLinkActive="active" class="nav-link">About Us</a>
          </li>
          <li class="nav-item">
            <a routerLink="/services" routerLinkActive="active" class="nav-link">Services</a>
          </li>
          <li class="nav-item">
            <a routerLink="/portfolio" routerLinkActive="active" class="nav-link">Portfolio</a>
          </li>
          <li class="nav-item">
            <a routerLink="/contact" routerLinkActive="active" class="nav-link">Contact</a>
          </li>
          
          <!-- Auth Links -->
          @if (authService.isAuthenticated()) {
            <li class="nav-item">
              <a 
                [routerLink]="authService.currentUser()?.role === 'ADMIN' ? '/admin' : '/client'" 
                class="nav-link btn-primary"
              >
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <button (click)="logout()" class="nav-link btn-secondary">
                Logout
              </button>
            </li>
          } @else {
            <li class="nav-item">
              <a routerLink="/login" class="nav-link btn-primary">Login</a>
            </li>
          }
        </ul>

        <!-- Mobile Menu Button -->
        <button
          class="mobile-menu-btn"
          (click)="toggleMenu()"
          [class.active]="isMenuOpen()"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isScrolled = signal(false);
  isMenuOpen = signal(false);

  authService = inject(AuthService);

  ngOnInit() {
    // Scroll effect for header
    window.addEventListener('scroll', () => {
      this.isScrolled.set(window.scrollY > 50);
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  logout(): void {
    this.authService.logout();
    this.isMenuOpen.set(false);
  }
}