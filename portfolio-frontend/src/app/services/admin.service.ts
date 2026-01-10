import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Dashboard Stats
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/dashboard/stats`);
  }

  // Projects
  getAllProjects(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/projects`);
  }

  // Project Requests
  getAllProjectRequests(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/project-requests`);
  }

  updateProjectRequestStatus(id: number, status: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/admin/project-requests/${id}/status`, { status });
  }

  // Services
  getAllServices(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/services`);
  }

  // Contacts
  getAllContacts(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/contacts`);
  }

  // Users
  getAllUsers(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/users`);
  }

  // Project Management
  createProject(projectData: any): Observable<ApiResponse<any>> {
    console.log('Creating project:', projectData);
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/admin/projects`, projectData);
  }

  updateProject(id: number, projectData: any): Observable<ApiResponse<any>> {
    console.log('Updating project:', id, projectData);
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/admin/projects/${id}`, projectData);
  }

  deleteProject(id: number): Observable<ApiResponse<any>> {
    console.log('Deleting project:', id);
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/admin/projects/${id}`);
  }

  // Service Management
  createService(serviceData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/admin/services`, serviceData);
  }

  updateService(id: number, serviceData: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/admin/services/${id}`, serviceData);
  }

  deleteService(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/admin/services/${id}`);
  }

  // User Management
  updateUser(id: number, userData: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/users/${id}`, userData);
  }

  deleteUser(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/users/${id}`);
  }
}