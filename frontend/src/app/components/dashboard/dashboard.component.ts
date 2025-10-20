import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: any = {
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    readyOrders: 0,
    totalRevenue: 0,
    pendingPayments: 0
  };
  recentOrders: any[] = [];
  paginatedOrders: any[] = [];
  loading = true;
  error = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.apiService.getDashboardStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
        }
        this.loadRecentOrders();
      },
      error: (err) => {
        this.error = 'Failed to load dashboard statistics';
        this.loading = false;
      }
    });
  }

  loadRecentOrders(): void {
    this.apiService.getAllOrders().subscribe({
      next: (response) => {
        if (response.success) {
          this.recentOrders = response.data;
          this.updatePagination();
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load recent orders';
        this.loading = false;
      }
    });
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.recentOrders.length / this.itemsPerPage);
    this.paginateData();
  }

  paginateData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.recentOrders.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateData();
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
