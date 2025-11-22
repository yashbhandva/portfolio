import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-payments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="client-payments">
      <h1>My Payments</h1>
      <p>View your payment history here</p>
    </div>
  `,
  styleUrls: ['./payments.component.scss']
})
export class ClientPaymentsComponent {
}