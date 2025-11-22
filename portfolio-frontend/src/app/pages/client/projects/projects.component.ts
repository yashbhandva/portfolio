import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="client-projects">
      <h1>My Projects</h1>
      <p>View your projects here</p>
    </div>
  `,
  styleUrls: ['./projects.component.scss']
})
export class ClientProjectsComponent {
}