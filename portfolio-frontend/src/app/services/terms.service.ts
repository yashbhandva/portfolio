import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TermsService {

  constructor() { }

  getTermsData(): Observable<any> {
    const dummyData = {
      status: 'success',
      data: {
        effectiveDate: 'October 25, 2023',
        acceptableUse: [
          {
            number: '1.1',
            title: 'Lawful Use',
            description: 'You agree to use our services only for lawful purposes and in accordance with these Terms.'
          },
          {
            number: '1.2',
            title: 'Prohibited Activities',
            description: 'You may not use our services to transmit any harmful code, spam, or engage in any activity that interferes with the performance of our services.'
          }
        ],
        userResponsibilities: [
          {
            icon: 'fa-user-shield',
            title: 'Account Security',
            description: 'You are responsible for maintaining the confidentiality of your account credentials.'
          },
          {
            icon: 'fa-check-circle',
            title: 'Compliance',
            description: 'You must comply with all applicable laws and regulations while using our services.'
          }
        ],
        paymentTerms: [
          {
            icon: 'fa-credit-card',
            title: 'Billing',
            description: 'Fees for our services are billed in advance on a monthly or annual basis.',
            note: 'Non-refundable'
          },
          {
            icon: 'fa-file-invoice-dollar',
            title: 'Invoicing',
            description: 'Invoices will be sent to the email address associated with your account.'
          }
        ],
        terminationPolicy: {
          description: 'We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever.',
          reasons: [
            'Violation of these Terms',
            'Non-payment of fees',
            'Illegal activity'
          ]
        }
      }
    };
    return of(dummyData);
  }
}