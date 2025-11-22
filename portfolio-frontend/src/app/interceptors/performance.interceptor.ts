import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { environment } from '../../environments/environment';

export const performanceInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.enablePerformanceLogging) {
    return next(req);
  }
  
  const startTime = performance.now();
  
  return next(req).pipe(
    finalize(() => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 1000) {
        console.warn(`Slow API call: ${req.url} took ${duration.toFixed(2)}ms`);
      } else if (duration > 500) {
        console.info(`API call: ${req.url} took ${duration.toFixed(2)}ms`);
      }
    })
  );
};