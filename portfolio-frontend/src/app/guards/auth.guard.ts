import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const userRole = this.authService.currentUser()?.role;
    const requiredRoles = route.data['roles'] as string[];

    if (!isAuthenticated) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: route.url.join('/') }
      });
      return false;
    }

    if (requiredRoles && !requiredRoles.includes(userRole || '')) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}