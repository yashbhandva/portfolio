import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pagination-container" *ngIf="totalItems > 0">
      <div class="page-size-selector">
        <span>Show</span>
        <select [(ngModel)]="pageSize" (change)="onPageSizeChange()">
          <option [value]="5">5</option>
          <option [value]="10">10</option>
          <option [value]="25">25</option>
          <option [value]="50">50</option>
        </select>
        <span>entries</span>
      </div>

      <div class="pagination-info">
        Showing {{ getStartIndex() }} to {{ getEndIndex() }} of {{ totalItems }} entries
      </div>

      <div class="pagination-buttons">
        <button
          class="btn-page"
          [disabled]="currentPage === 1"
          (click)="changePage(currentPage - 1)">
          <i class="fas fa-chevron-left"></i>
        </button>

        <ng-container *ngFor="let page of pages">
          <button
            class="btn-page"
            [class.active]="page === currentPage"
            (click)="changePage(page)">
            {{ page }}
          </button>
        </ng-container>

        <button
          class="btn-page"
          [disabled]="currentPage === totalPages"
          (click)="changePage(currentPage + 1)">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-top: 1px solid #e5e7eb;
      margin-top: 1rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-size-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6b7280;
      font-size: 0.875rem;

      select {
        padding: 0.25rem 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        background-color: white;
        color: #374151;
        cursor: pointer;

        &:focus {
          outline: none;
          border-color: #2563eb;
        }
      }
    }

    .pagination-info {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .pagination-buttons {
      display: flex;
      gap: 0.25rem;
    }

    .btn-page {
      min-width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #d1d5db;
      background: white;
      color: #374151;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background-color: #f3f4f6;
        border-color: #9ca3af;
      }

      &.active {
        background-color: #2563eb;
        color: white;
        border-color: #2563eb;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #f9fafb;
      }
    }

    @media (max-width: 640px) {
      .pagination-container {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }
  `]
})
export class PaginationControlsComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  totalPages = 0;
  pages: number[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalItems'] || changes['pageSize']) {
      this.calculatePages();
    }
  }

  calculatePages() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = [];

    // Simple pagination logic (show all pages or limited window)
    // For simplicity, showing max 5 pages window
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange() {
    this.pageSizeChange.emit(this.pageSize);
    // Reset to page 1 when size changes
    this.pageChange.emit(1);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }
}