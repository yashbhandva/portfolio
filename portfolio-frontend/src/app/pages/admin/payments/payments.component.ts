import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-payments">
      <h1>Payments Management</h1>
      <p>Manage payments here</p>
    </div>
  `,
  styleUrls: ['./payments.component.scss']
})
export class AdminPaymentsComponent {
}