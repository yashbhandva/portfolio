import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  template: `
    @if (!isDashboardRoute) {
      <app-header></app-header>
    }
    <main [class.dashboard-main]="isDashboardRoute">
      <router-outlet></router-outlet>
    </main>
    @if (!isDashboardRoute) {
      <app-footer></app-footer>
    }
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Portfolio Website';
  isDashboardRoute = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).url;
        // Check if the current route is a dashboard route
        this.isDashboardRoute = url.includes('/admin') || url.includes('/client');
      });
  }
}