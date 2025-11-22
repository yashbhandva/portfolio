import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ContactRequest, ContactResponse, UpdateContactStatus } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl;
  
  // Using Signals for state management
  loading = signal<boolean>(false);
  submissionSuccess = signal<boolean>(false);
  submissionError = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  // 📢 PUBLIC METHODS
  createContact(contactData: ContactRequest): Observable<ApiResponse<ContactResponse>> {
    this.loading.set(true);
    this.submissionError.set(null);
    
    return this.http.post<ApiResponse<ContactResponse>>(
      `${this.apiUrl}/public/contact`,
      contactData
    ).pipe(
      tap({
        next: (response) => {
          this.loading.set(false);
          if (response.status === 'success') {
            this.submissionSuccess.set(true);
          } else {
            this.submissionError.set(response.message);
          }
        },
        error: (error) => {
          this.loading.set(false);
          this.submissionError.set(
            error.error?.message || 'Failed to send message. Please try again.'
          );
        }
      })
    );
  }

  // 🛠️ ADMIN METHODS
  getAllContacts(): Observable<ApiResponse<ContactResponse[]>> {
    return this.http.get<ApiResponse<ContactResponse[]>>(
      `${this.apiUrl}/admin/contacts`
    );
  }

  getContactsByStatus(status: string): Observable<ApiResponse<ContactResponse[]>> {
    return this.http.get<ApiResponse<ContactResponse[]>>(
      `${this.apiUrl}/admin/contacts/status/${status}`
    );
  }

  updateContactStatus(id: number, statusData: UpdateContactStatus): Observable<ApiResponse<ContactResponse>> {
    return this.http.put<ApiResponse<ContactResponse>>(
      `${this.apiUrl}/admin/contacts/${id}/status`,
      statusData
    );
  }

  getUserContacts(userId: number): Observable<ApiResponse<ContactResponse[]>> {
    return this.http.get<ApiResponse<ContactResponse[]>>(
      `${this.apiUrl}/admin/contacts/user/${userId}`
    );
  }

  // Reset submission state
  resetSubmissionState(): void {
    this.submissionSuccess.set(false);
    this.submissionError.set(null);
  }
}