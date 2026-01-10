import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal to hold the current theme
  currentTheme = signal<'light' | 'dark'>('light');

  constructor() {
    // Load theme from local storage on initialization
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
    } else {
      // Or use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme.set(prefersDark ? 'dark' : 'light');
    }

    // Effect to update the DOM when the theme changes
    effect(() => {
      const theme = this.currentTheme();
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }

  toggleTheme() {
    this.currentTheme.update(theme => (theme === 'light' ? 'dark' : 'light'));
  }
}