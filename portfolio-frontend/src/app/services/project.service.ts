import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ProjectSummary, ProjectResponse, ProjectRequest } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = environment.apiUrl;
  private baseUrl = 'https://portfolio-latest-hqe4.onrender.com';

  // Using Signals for state management
  publicProjects = signal<ProjectSummary[]>([]);
  allProjects = signal<ProjectResponse[]>([]);
  featuredProjects = signal<ProjectSummary[]>([]);
  projectCategories = signal<string[]>([]);
  loading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  // 📢 PUBLIC METHODS
  getAllProjects(): Observable<ApiResponse<ProjectSummary[]>> {
    this.loading.set(true);
    return this.http.get<ApiResponse<ProjectSummary[]>>(
      `${this.apiUrl}/public/projects`
    ).pipe(
      map(response => {
        if (response.status === 'success') {
          response.data.forEach(project => {
            if (project.imageUrl && !project.imageUrl.startsWith('http')) {
              project.imageUrl = `${this.baseUrl}${project.imageUrl}`;
            }
          });
        }
        return response;
      }),
      tap(response => {
        if (response.status === 'success') {
          this.publicProjects.set(response.data);
        }
        this.loading.set(false);
      })
    );
  }

  getFeaturedProjects(): Observable<ApiResponse<ProjectSummary[]>> {
    return this.http.get<ApiResponse<ProjectSummary[]>>(
      `${this.apiUrl}/public/projects/featured`
    ).pipe(
      map(response => {
        if (response.status === 'success') {
          response.data.forEach(project => {
            if (project.imageUrl && !project.imageUrl.startsWith('http')) {
              project.imageUrl = `${this.baseUrl}${project.imageUrl}`;
            }
          });
        }
        return response;
      }),
      tap(response => {
        if (response.status === 'success') {
          this.featuredProjects.set(response.data);
        }
      })
    );
  }

  getPublicProjectById(id: number): Observable<ApiResponse<ProjectSummary>> {
    return this.http.get<ApiResponse<ProjectSummary>>(
      `${this.apiUrl}/public/projects/${id}`
    ).pipe(
      map(response => {
        if (response.status === 'success' && response.data.imageUrl && !response.data.imageUrl.startsWith('http')) {
          response.data.imageUrl = `${this.baseUrl}${response.data.imageUrl}`;
        }
        return response;
      })
    );
  }

  getProjectsByCategory(category: string): Observable<ApiResponse<ProjectSummary[]>> {
    return this.http.get<ApiResponse<ProjectSummary[]>>(
      `${this.apiUrl}/public/projects/category/${category}`
    ).pipe(
      map(response => {
        if (response.status === 'success') {
          response.data.forEach(project => {
            if (project.imageUrl && !project.imageUrl.startsWith('http')) {
              project.imageUrl = `${this.baseUrl}${project.imageUrl}`;
            }
          });
        }
        return response;
      })
    );
  }

  getAllCategories(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(
      `${this.apiUrl}/public/categories`
    ).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.projectCategories.set(response.data);
        }
      })
    );
  }

  searchProjectsByTitle(title: string): Observable<ApiResponse<ProjectSummary[]>> {
    return this.http.get<ApiResponse<ProjectSummary[]>>(
      `${this.apiUrl}/public/projects/search/title`,
      { params: { title } }
    ).pipe(
      map(response => {
        if (response.status === 'success') {
          response.data.forEach(project => {
            if (project.imageUrl && !project.imageUrl.startsWith('http')) {
              project.imageUrl = `${this.baseUrl}${project.imageUrl}`;
            }
          });
        }
        return response;
      })
    );
  }

  searchProjectsByTechnology(technology: string): Observable<ApiResponse<ProjectSummary[]>> {
    return this.http.get<ApiResponse<ProjectSummary[]>>(
      `${this.apiUrl}/public/projects/search/technology`,
      { params: { technology } }
    ).pipe(
      map(response => {
        if (response.status === 'success') {
          response.data.forEach(project => {
            if (project.imageUrl && !project.imageUrl.startsWith('http')) {
              project.imageUrl = `${this.baseUrl}${project.imageUrl}`;
            }
          });
        }
        return response;
      })
    );
  }

  searchProjects(keyword: string): Observable<ApiResponse<ProjectSummary[]>> {
    return this.http.get<ApiResponse<ProjectSummary[]>>(
      `${this.apiUrl}/public/projects/search`,
      { params: { keyword } }
    ).pipe(
      map(response => {
        if (response.status === 'success') {
          response.data.forEach(project => {
            if (project.imageUrl && !project.imageUrl.startsWith('http')) {
              project.imageUrl = `${this.baseUrl}${project.imageUrl}`;
            }
          });
        }
        return response;
      })
    );
  }

  // 🛠️ ADMIN METHODS
  getAllAdminProjects(): Observable<ApiResponse<ProjectResponse[]>> {
    this.loading.set(true);
    return this.http.get<ApiResponse<ProjectResponse[]>>(
      `${this.apiUrl}/admin/projects`
    ).pipe(
      map(response => {
        if (response.status === 'success') {
          response.data.forEach(project => {
            if (project.imageUrl && !project.imageUrl.startsWith('http')) {
              project.imageUrl = `${this.baseUrl}${project.imageUrl}`;
            }
          });
        }
        return response;
      }),
      tap(response => {
        if (response.status === 'success') {
          this.allProjects.set(response.data);
        }
        this.loading.set(false);
      })
    );
  }

  getAdminProjectById(id: number): Observable<ApiResponse<ProjectResponse>> {
    return this.http.get<ApiResponse<ProjectResponse>>(
      `${this.apiUrl}/admin/projects/${id}`
    ).pipe(
      map(response => {
        if (response.status === 'success' && response.data.imageUrl && !response.data.imageUrl.startsWith('http')) {
          response.data.imageUrl = `${this.baseUrl}${response.data.imageUrl}`;
        }
        return response;
      })
    );
  }

  createProject(projectData: ProjectRequest): Observable<ApiResponse<ProjectResponse>> {
    return this.http.post<ApiResponse<ProjectResponse>>(
      `${this.apiUrl}/admin/projects`,
      projectData
    );
  }

  updateProject(id: number, projectData: ProjectRequest): Observable<ApiResponse<ProjectResponse>> {
    return this.http.put<ApiResponse<ProjectResponse>>(
      `${this.apiUrl}/admin/projects/${id}`,
      projectData
    );
  }

  deleteProject(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(
      `${this.apiUrl}/admin/projects/${id}`
    );
  }
}