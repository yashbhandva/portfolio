import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'PROJECT_REQUEST' | 'PROJECT_UPDATE' | 'PAYMENT' | 'SYSTEM';
  read: boolean;
  referenceId: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.apiUrl;

  notifications = signal<Notification[]>([]);
  unreadCount = signal<number>(0);

  constructor(private http: HttpClient) {
    // Start polling for notifications if user is logged in
    this.startPolling();
  }

  startPolling() {
    setInterval(() => {
      if (localStorage.getItem('token')) {
        this.loadUnreadCount();
      }
    }, 30000); // Poll every 30 seconds
  }

  loadNotifications(): Observable<ApiResponse<Notification[]>> {
    return this.http.get<ApiResponse<Notification[]>>(`${this.apiUrl}/notifications`).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.notifications.set(response.data);
        }
      })
    );
  }

  loadUnreadCount() {
    this.http.get<ApiResponse<number>>(`${this.apiUrl}/notifications/unread-count`).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.unreadCount.set(response.data);
        }
      }
    });
  }

  markAsRead(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/notifications/${id}/read`, {}).pipe(
      tap(() => {
        this.notifications.update(notifications =>
          notifications.map(n => n.id === id ? { ...n, read: true } : n)
        );
        this.loadUnreadCount();
      })
    );
  }

  markAllAsRead(): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/notifications/read-all`, {}).pipe(
      tap(() => {
        this.notifications.update(notifications =>
          notifications.map(n => ({ ...n, read: true }))
        );
        this.unreadCount.set(0);
      })
    );
  }
}