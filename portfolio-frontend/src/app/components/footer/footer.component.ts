import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <!-- Company Info -->
        <div class="footer-section">
          <h3 class="footer-logo">Portfolio</h3>
          <p class="footer-description">
            We create amazing digital experiences and help businesses grow online. 
            Let's build something great together.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn">
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="#" class="social-link" aria-label="GitHub">
              <i class="fab fa-github"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h4 class="footer-title">Quick Links</h4>
          <ul class="footer-links">
            <li><a routerLink="/" class="footer-link">Home</a></li>
            <li><a routerLink="/about" class="footer-link">About Us</a></li>
            <li><a routerLink="/services" class="footer-link">Services</a></li>
            <li><a routerLink="/portfolio" class="footer-link">Portfolio</a></li>
            <li><a routerLink="/contact" class="footer-link">Contact</a></li>
          </ul>
        </div>

        <!-- Services -->
        <div class="footer-section">
          <h4 class="footer-title">Services</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Web Development</a></li>
            <li><a href="#" class="footer-link">Mobile Apps</a></li>
            <li><a href="#" class="footer-link">UI/UX Design</a></li>
            <li><a href="#" class="footer-link">Digital Marketing</a></li>
            <li><a href="#" class="footer-link">SEO Optimization</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-section">
          <h4 class="footer-title">Contact Info</h4>
          <div class="contact-info">
            <div class="contact-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>Moda(Kutch) Gujarat, India 370 155</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-phone"></i>
              <span>+91 95125 70683</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <span>yashbhandva01&#64;gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-bottom-container">
          <p>&copy; 2024 Portfolio Website. All rights reserved.</p>
          <div class="footer-bottom-links">
            <a routerLink="/privacy-policy" class="footer-bottom-link">Privacy Policy</a>
            <a routerLink="/terms-of-service" class="footer-bottom-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {}