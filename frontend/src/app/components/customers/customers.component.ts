import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  filteredCustomers: any[] = [];
  paginatedCustomers: any[] = [];
  searchQuery = '';
  showModal = false;
  isEditMode = false;
  loading = true;
  error = '';
  successMessage = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  customerForm = {
    id: null,
    name: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  };

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.apiService.getAllCustomers().subscribe({
      next: (response) => {
        if (response.success) {
          this.customers = response.data;
          this.filteredCustomers = response.data;
          this.updatePagination();
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load customers';
        this.loading = false;
      }
    });
  }

  searchCustomers(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredCustomers = this.customers;
    } else {
      this.filteredCustomers = this.customers.filter(customer =>
        customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        customer.phone.includes(this.searchQuery) ||
        (customer.email && customer.email.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(customer: any): void {
    this.isEditMode = true;
    this.customerForm = { ...customer };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.customerForm = {
      id: null,
      name: '',
      email: '',
      phone: '',
      address: '',
      city: ''
    };
  }

  saveCustomer(): void {
    if (!this.customerForm.name || !this.customerForm.phone) {
      this.error = 'Name and phone are required';
      return;
    }

    if (this.isEditMode) {
      this.apiService.updateCustomer(this.customerForm.id!, this.customerForm).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Customer updated successfully';
            this.loadCustomers();
            this.closeModal();
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (err) => {
          this.error = 'Failed to update customer';
        }
      });
    } else {
      this.apiService.createCustomer(this.customerForm).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Customer created successfully';
            this.loadCustomers();
            this.closeModal();
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create customer';
        }
      });
    }
  }

  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.apiService.deleteCustomer(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Customer deleted successfully';
            this.loadCustomers();
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (err) => {
          this.error = 'Failed to delete customer';
        }
      });
    }
  }

  viewMeasurements(customerId: number): void {
    this.router.navigate(['/measurements', customerId]);
  }

  viewOrders(customerId: number): void {
    this.router.navigate(['/orders'], { queryParams: { customerId } });
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
    this.paginateData();
  }

  paginateData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCustomers = this.filteredCustomers.slice(startIndex, endIndex);
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
