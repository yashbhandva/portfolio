import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-team',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="team-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Team Management</h1>
          <p class="page-subtitle">Manage team members and their roles</p>
        </div>
        <button class="btn btn-primary">
          <i class="fas fa-plus"></i>
          Add Team Member
        </button>
      </div>

      <div class="team-grid">
        @for (member of teamMembers(); track member.id) {
          <div class="member-card">
            <div class="member-avatar">
              <img [src]="member.avatar" [alt]="member.name" *ngIf="member.avatar">
              <div class="avatar-placeholder" *ngIf="!member.avatar">
                {{ member.name.charAt(0) }}
              </div>
            </div>

            <div class="member-info">
              <h3 class="member-name">{{ member.name }}</h3>
              <p class="member-role">{{ member.role }}</p>
              <p class="member-email">{{ member.email }}</p>
            </div>

            <div class="member-skills">
              <span class="skill-tag" *ngFor="let skill of member.skills">
                {{ skill }}
              </span>
            </div>

            <div class="member-stats">
              <div class="stat-item">
                <span class="stat-value">{{ member.projectsCompleted }}</span>
                <span class="stat-label">Projects</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ member.rating }}</span>
                <span class="stat-label">Rating</span>
              </div>
            </div>

            <div class="member-actions">
              <button class="btn btn-outline btn-sm" (click)="editMember(member.id)">
                <i class="fas fa-edit"></i>
                Edit
              </button>
              <button class="btn btn-danger btn-sm" (click)="removeMember(member.id)">
                <i class="fas fa-trash"></i>
                Remove
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  teamMembers = signal<any[]>([]);

  ngOnInit() {
    this.loadTeamMembers();
  }

  private loadTeamMembers(): void {
    setTimeout(() => {
      this.teamMembers.set([
        {
          id: 1,
          name: 'Alex Johnson',
          role: 'Full Stack Developer',
          email: 'alex@portfolio.com',
          avatar: null,
          skills: ['React', 'Node.js', 'MongoDB'],
          projectsCompleted: 25,
          rating: 4.9
        },
        {
          id: 2,
          name: 'Sarah Wilson',
          role: 'UI/UX Designer',
          email: 'sarah@portfolio.com',
          avatar: null,
          skills: ['Figma', 'Adobe XD', 'Sketch'],
          projectsCompleted: 18,
          rating: 4.8
        }
      ]);
    }, 1000);
  }

  editMember(memberId: number): void {
    console.log('Edit member:', memberId);
  }

  removeMember(memberId: number): void {
    if (confirm('Are you sure you want to remove this team member?')) {
      console.log('Remove member:', memberId);
    }
  }
}