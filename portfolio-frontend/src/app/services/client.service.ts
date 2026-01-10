import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMyMessagesCount(email: string): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/client/messages/count?email=${email}`);
  }

  getMyProjectRequests(): Observable<ApiResponse<any[]>> {
    // No longer need to pass userId, it's derived from the JWT on the backend
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/client/project-requests`);
  }

  createProjectRequest(request: any): Observable<ApiResponse<any>> {
    // No longer need to pass userId, it's derived from the JWT on the backend
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/client/project-requests`, request);
  }
}