import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrivacyService {

  constructor() { }

  getPrivacyData(): Observable<any> {
    const dummyData = {
      status: 'success',
      data: {
        lastUpdated: 'October 25, 2023',
        dataCollection: [
          {
            icon: 'fa-user',
            title: 'Personal Information',
            description: 'We collect information you provide directly to us, such as your name, email address, and phone number.'
          },
          {
            icon: 'fa-laptop-code',
            title: 'Usage Data',
            description: 'We automatically collect certain information about your device and how you interact with our services.'
          }
        ],
        dataUsage: [
          'To provide, maintain, and improve our services.',
          'To communicate with you about products, services, offers, and events.',
          'To monitor and analyze trends, usage, and activities in connection with our services.'
        ],
        securityFeatures: [
          {
            icon: 'fa-lock',
            title: 'Encryption',
            description: 'We use SSL/TLS encryption to protect your data during transmission.'
          },
          {
            icon: 'fa-shield-alt',
            title: 'Access Controls',
            description: 'We restrict access to personal information to authorized employees and contractors.'
          }
        ]
      }
    };
    return of(dummyData);
  }
}