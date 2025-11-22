import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private router = inject(Router);
  private analyticsEnabled = true;

  constructor() {
    this.initPerformanceMonitoring();
    this.initRouteTracking();
  }

  private initPerformanceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry);
            this.logPerformanceIssue('long_task', {
              duration: entry.duration,
              name: entry.name
            });
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Long task monitoring not supported');
      }
    }
  }

  private initRouteTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.trackPageView(event.urlAfterRedirects);
      this.preloadRoutes(event.urlAfterRedirects);
    });
  }

  private trackPageView(url: string): void {
    if (!this.analyticsEnabled) return;
    console.log('Page view:', url);
  }

  private preloadRoutes(currentUrl: string): void {
    const routesToPreload = this.getRoutesToPreload(currentUrl);
    
    routesToPreload.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      link.as = 'document';
      document.head.appendChild(link);
    });
  }

  private getRoutesToPreload(currentUrl: string): string[] {
    const preloadMap: { [key: string]: string[] } = {
      '/': ['/about', '/services'],
      '/services': ['/portfolio', '/contact'],
      '/portfolio': ['/services', '/contact'],
      '/about': ['/services', '/portfolio']
    };

    return preloadMap[currentUrl] || [];
  }

  logPerformanceIssue(type: string, data: any): void {
    if (!this.analyticsEnabled) return;
    console.warn(`Performance Issue (${type}):`, data);
  }

  optimizeImage(src: string, width: number, height: number): string {
    return `${src}?width=${width}&height=${height}&format=webp&quality=80`;
  }

  initLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset['src'] || '';
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
}