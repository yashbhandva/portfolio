import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getMyProjectRequests(clientId: number): Observable<ApiResponse<any[]>> {
    const headers = new HttpHeaders().set('userId', clientId.toString());
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/client/project-requests`, { headers });
  }

  createProjectRequest(clientId: number, request: any): Observable<ApiResponse<any>> {
    const headers = new HttpHeaders().set('userId', clientId.toString());
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/client/project-requests`, request, { headers });
  }
}