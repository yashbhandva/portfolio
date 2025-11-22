import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const cache = new Map<string, { data: any; timestamp: number }>();

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests for public endpoints
  if (req.method !== 'GET' || req.url.includes('/auth/') || req.url.includes('/admin/')) {
    return next(req);
  }

  const cachedResponse = cache.get(req.urlWithParams);
  
  if (cachedResponse && Date.now() - cachedResponse.timestamp < environment.cacheTimeout) {
    return of(new HttpResponse({ body: cachedResponse.data }));
  }

  if (cachedResponse) {
    cache.delete(req.urlWithParams);
  }

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse && event.ok) {
        cache.set(req.urlWithParams, {
          data: event.body,
          timestamp: Date.now()
        });
      }
    })
  );
};