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
    @if (!isAdminRoute) {
      <app-header></app-header>
    }
    <main [class.admin-main]="isAdminRoute">
      <router-outlet></router-outlet>
    </main>
    @if (!isAdminRoute) {
      <app-footer></app-footer>
    }
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Portfolio Website';
  isAdminRoute = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.isAdminRoute = (event as NavigationEnd).url.startsWith('/admin');
      });
  }
}