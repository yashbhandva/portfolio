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

  getMyMessages(userId: number): Observable<ApiResponse<any[]>> {
    // Note: We need to add this endpoint to ClientController or ContactController
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/client/messages`);
  }

  getMyProjectRequests(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/client/project-requests`);
  }

  createProjectRequest(request: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/client/project-requests`, request);
  }
}