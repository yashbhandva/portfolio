import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { PublicService, ServiceResponse, ServiceRequest } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = environment.apiUrl;
  
  // Using Signals for state management
  publicServices = signal<PublicService[]>([]);
  allServices = signal<ServiceResponse[]>([]);
  serviceCategories = signal<string[]>([]);
  loading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  // 📢 PUBLIC METHODS
  getActiveServices(): Observable<ApiResponse<PublicService[]>> {
    this.loading.set(true);
    return this.http.get<ApiResponse<PublicService[]>>(
      `${this.apiUrl}/public/services`
    ).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.publicServices.set(response.data);
        }
        this.loading.set(false);
      })
    );
  }

  getPublicServiceById(id: number): Observable<ApiResponse<PublicService>> {
    return this.http.get<ApiResponse<PublicService>>(
      `${this.apiUrl}/public/services/${id}`
    );
  }

  getServicesByCategory(category: string): Observable<ApiResponse<PublicService[]>> {
    return this.http.get<ApiResponse<PublicService[]>>(
      `${this.apiUrl}/public/services/category/${category}`
    );
  }

  getServiceCategories(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(
      `${this.apiUrl}/public/service-categories`
    ).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.serviceCategories.set(response.data);
        }
      })
    );
  }

  searchServicesByName(name: string): Observable<ApiResponse<PublicService[]>> {
    return this.http.get<ApiResponse<PublicService[]>>(
      `${this.apiUrl}/public/services/search/name`,
      { params: { name } }
    );
  }

  searchServices(keyword: string): Observable<ApiResponse<PublicService[]>> {
    return this.http.get<ApiResponse<PublicService[]>>(
      `${this.apiUrl}/public/services/search`,
      { params: { keyword } }
    );
  }

  getServicesByPriceRange(minPrice: number, maxPrice: number): Observable<ApiResponse<PublicService[]>> {
    return this.http.get<ApiResponse<PublicService[]>>(
      `${this.apiUrl}/public/services/price-range`,
      { params: { minPrice, maxPrice } }
    );
  }

  // 🛠️ ADMIN METHODS
  getAllServices(): Observable<ApiResponse<ServiceResponse[]>> {
    this.loading.set(true);
    return this.http.get<ApiResponse<ServiceResponse[]>>(
      `${this.apiUrl}/admin/services`
    ).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.allServices.set(response.data);
        }
        this.loading.set(false);
      })
    );
  }

  getServiceById(id: number): Observable<ApiResponse<ServiceResponse>> {
    return this.http.get<ApiResponse<ServiceResponse>>(
      `${this.apiUrl}/admin/services/${id}`
    );
  }

  createService(serviceData: ServiceRequest): Observable<ApiResponse<ServiceResponse>> {
    return this.http.post<ApiResponse<ServiceResponse>>(
      `${this.apiUrl}/admin/services`,
      serviceData
    );
  }

  updateService(id: number, serviceData: ServiceRequest): Observable<ApiResponse<ServiceResponse>> {
    return this.http.put<ApiResponse<ServiceResponse>>(
      `${this.apiUrl}/admin/services/${id}`,
      serviceData
    );
  }

  deleteService(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(
      `${this.apiUrl}/admin/services/${id}`
    );
  }
}