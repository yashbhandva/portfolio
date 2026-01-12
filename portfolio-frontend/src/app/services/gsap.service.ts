import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

@Injectable({
  providedIn: 'root'
})
export class GsapService {
  private tl = gsap.timeline();
  private scrollTriggers: ScrollTrigger[] = [];

  animateHeroSection(): void {
    this.tl.clear();

    this.tl.fromTo('.hero-title', 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    this.tl.fromTo('.hero-description',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    );

    this.tl.fromTo('.hero-buttons',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
      '-=0.3'
    );

    this.tl.fromTo('.stat-number',
      { textContent: 0, opacity: 0 },
      {
        textContent: (i: number, el: HTMLElement) => {
          const target = parseInt(el.getAttribute('countUp') || '0');
          return target;
        },
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
        stagger: 0.2,
        snap: { textContent: 1 }
      },
      '-=0.2'
    );
  }

  initScrollAnimations(): void {
    // Kill old triggers before creating new ones
    this.destroyScrollTriggers();

    // Ensure DOM is ready
    ScrollTrigger.refresh();

    gsap.utils.toArray('.service-card').forEach((card: any) => {
      const trigger = gsap.fromTo(card,
        { y: 100, opacity: 0, rotationY: -15 },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%', // Adjusted start position
            end: 'bottom 15%',
            toggleActions: 'play none none reverse',
            // markers: true // Uncomment for debugging
          }
        }
      );
      if (trigger.scrollTrigger) this.scrollTriggers.push(trigger.scrollTrigger);
    });

    gsap.utils.toArray('.project-card').forEach((card: any, i) => {
      const trigger = gsap.fromTo(card,
        { y: 100, opacity: 0, scale: 0.9 }, // Reduced scale effect
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.2)',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      if (trigger.scrollTrigger) this.scrollTriggers.push(trigger.scrollTrigger);
    });

    gsap.utils.toArray('.section-title').forEach((title: any) => {
      const trigger = gsap.fromTo(title,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      if (trigger.scrollTrigger) this.scrollTriggers.push(trigger.scrollTrigger);
    });

    // Force a refresh after setting up triggers
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }

  initButtonAnimations(): void {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }

  destroyScrollTriggers(): void {
    // Kill all ScrollTriggers created by this service
    this.scrollTriggers.forEach(trigger => trigger.kill());
    this.scrollTriggers = [];

    // Kill all GSAP tweens to prevent conflicts
    gsap.killTweensOf('.service-card');
    gsap.killTweensOf('.project-card');
    gsap.killTweensOf('.section-title');

    // Global kill for safety (optional, but good for cleanup)
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  destroy(): void {
    this.tl.kill();
    this.destroyScrollTriggers();
  }
}