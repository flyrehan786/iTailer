import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  paginatedOrders: any[] = [];
  customers: any[] = [];
  measurements: any[] = [];
  showModal = false;
  showPaymentModal = false;
  isEditMode = false;
  loading = true;
  error = '';
  successMessage = '';
  selectedOrder: any = null;
  
  // Search and Filters
  searchQuery = '';
  statusFilter = '';
  paymentFilter = '';
  dateFromFilter = '';
  dateToFilter = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  orderForm = {
    id: null,
    customer_id: null,
    order_date: '',
    delivery_date: '',
    status: 'pending',
    total_amount: 0,
    advance_payment: 0,
    notes: '',
    items: [
      {
        measurement_id: null,
        item_type: 'shirt',
        quantity: 1,
        fabric_type: '',
        color: '',
        design_details: '',
        price: 0
      }
    ]
  };

  paymentForm = {
    order_id: null,
    amount: 0,
    payment_date: '',
    payment_method: 'cash',
    notes: ''
  };

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadOrders();
    this.loadCustomers();
    
    this.route.queryParams.subscribe(params => {
      if (params['customerId']) {
        this.filterByCustomer(Number(params['customerId']));
      }
    });
  }

  loadOrders(): void {
    this.loading = true;
    this.apiService.getAllOrders().subscribe({
      next: (response) => {
        if (response.success) {
          this.orders = response.data;
          this.filteredOrders = response.data;
          this.updatePagination();
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  loadCustomers(): void {
    this.apiService.getAllCustomers().subscribe({
      next: (response) => {
        if (response.success) {
          this.customers = response.data;
        }
      },
      error: (err) => {
        console.error('Failed to load customers');
      }
    });
  }

  loadMeasurements(customerId: number): void {
    this.apiService.getMeasurementsByCustomer(customerId).subscribe({
      next: (response) => {
        if (response.success) {
          this.measurements = response.data;
        }
      },
      error: (err) => {
        console.error('Failed to load measurements');
      }
    });
  }

  filterByCustomer(customerId: number): void {
    this.apiService.getOrdersByCustomer(customerId).subscribe({
      next: (response) => {
        if (response.success) {
          this.orders = response.data;
          this.filteredOrders = response.data;
          this.updatePagination();
        }
      },
      error: (err) => {
        this.error = 'Failed to filter orders';
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.resetForm();
    const today = new Date().toISOString().split('T')[0];
    this.orderForm.order_date = today;
    this.showModal = true;
  }

  openEditModal(order: any): void {
    this.isEditMode = true;
    this.apiService.getOrderById(order.id).subscribe({
      next: (response) => {
        if (response.success) {
          const orderData = response.data;
          this.orderForm = {
            id: orderData.id,
            customer_id: orderData.customer_id,
            order_date: orderData.order_date.split('T')[0],
            delivery_date: orderData.delivery_date ? orderData.delivery_date.split('T')[0] : '',
            status: orderData.status,
            total_amount: orderData.total_amount,
            advance_payment: orderData.advance_payment,
            notes: orderData.notes || '',
            items: orderData.items.length > 0 ? orderData.items : [
              {
                measurement_id: null,
                item_type: 'shirt',
                quantity: 1,
                fabric_type: '',
                color: '',
                design_details: '',
                price: 0
              }
            ]
          };
          this.loadMeasurements(orderData.customer_id);
          this.showModal = true;
        }
      },
      error: (err) => {
        this.error = 'Failed to load order details';
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.orderForm = {
      id: null,
      customer_id: null,
      order_date: '',
      delivery_date: '',
      status: 'pending',
      total_amount: 0,
      advance_payment: 0,
      notes: '',
      items: [
        {
          measurement_id: null,
          item_type: 'shirt',
          quantity: 1,
          fabric_type: '',
          color: '',
          design_details: '',
          price: 0
        }
      ]
    };
    this.measurements = [];
  }

  onCustomerChange(): void {
    if (this.orderForm.customer_id) {
      this.loadMeasurements(this.orderForm.customer_id);
    }
  }

  addItem(): void {
    this.orderForm.items.push({
      measurement_id: null,
      item_type: 'shirt',
      quantity: 1,
      fabric_type: '',
      color: '',
      design_details: '',
      price: 0
    });
  }

  removeItem(index: number): void {
    if (this.orderForm.items.length > 1) {
      this.orderForm.items.splice(index, 1);
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    this.orderForm.total_amount = this.orderForm.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  saveOrder(): void {
    if (!this.orderForm.customer_id || !this.orderForm.order_date || this.orderForm.items.length === 0) {
      this.error = 'Customer, order date, and at least one item are required';
      return;
    }

    this.calculateTotal();

    // Clean the order data
    const cleanedOrder: any = {
      customer_id: this.orderForm.customer_id,
      order_date: this.orderForm.order_date,
      delivery_date: this.orderForm.delivery_date || null,
      status: this.orderForm.status,
      total_amount: this.orderForm.total_amount || 0,
      advance_payment: this.orderForm.advance_payment || 0,
      notes: this.orderForm.notes || '',
      items: this.orderForm.items.map(item => ({
        measurement_id: item.measurement_id || null,
        item_type: item.item_type,
        quantity: item.quantity || 1,
        fabric_type: item.fabric_type || '',
        color: item.color || '',
        design_details: item.design_details || '',
        price: item.price || 0
      }))
    };

    if (this.isEditMode) {
      cleanedOrder.id = this.orderForm.id;
      this.apiService.updateOrder(this.orderForm.id!, cleanedOrder).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Order updated successfully';
            this.loadOrders();
            this.closeModal();
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update order';
          console.error('Update order error:', err);
        }
      });
    } else {
      this.apiService.createOrder(cleanedOrder).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Order created successfully';
            this.loadOrders();
            this.closeModal();
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create order';
          console.error('Create order error:', err);
        }
      });
    }
  }

  updateStatus(orderId: number, status: string): void {
    this.apiService.updateOrderStatus(orderId, status).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Order status updated successfully';
          this.loadOrders();
          setTimeout(() => this.successMessage = '', 3000);
        }
      },
      error: (err) => {
        this.error = 'Failed to update order status';
      }
    });
  }

  deleteOrder(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.apiService.deleteOrder(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Order deleted successfully';
            this.loadOrders();
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (err) => {
          this.error = 'Failed to delete order';
        }
      });
    }
  }

  openPaymentModal(order: any): void {
    this.selectedOrder = order;
    const today = new Date().toISOString().split('T')[0];
    this.paymentForm = {
      order_id: order.id,
      amount: order.remaining_payment || 0,
      payment_date: today,
      payment_method: 'cash',
      notes: ''
    };
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedOrder = null;
  }

  savePayment(): void {
    if (!this.paymentForm.amount || !this.paymentForm.payment_date) {
      this.error = 'Amount and payment date are required';
      return;
    }

    // Clean payment data
    const cleanedPayment = {
      order_id: this.paymentForm.order_id,
      amount: parseFloat(this.paymentForm.amount.toString()) || 0,
      payment_date: this.paymentForm.payment_date,
      payment_method: this.paymentForm.payment_method || 'cash',
      notes: this.paymentForm.notes || ''
    };

    this.apiService.createPayment(cleanedPayment).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Payment recorded successfully';
          this.loadOrders();
          this.closePaymentModal();
          setTimeout(() => this.successMessage = '', 3000);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to record payment';
        console.error('Payment error:', err);
      }
    });
  }

  // Search and Filter methods
  applyFilters(): void {
    let filtered = [...this.orders];

    // Search filter
    if (this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toString().includes(query) ||
        order.customer_name.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (this.statusFilter) {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }

    // Payment filter
    if (this.paymentFilter === 'paid') {
      filtered = filtered.filter(order => order.remaining_payment === 0);
    } else if (this.paymentFilter === 'pending') {
      filtered = filtered.filter(order => order.remaining_payment > 0);
    }

    // Date range filter
    if (this.dateFromFilter) {
      const fromDate = new Date(this.dateFromFilter);
      filtered = filtered.filter(order => new Date(order.order_date) >= fromDate);
    }

    if (this.dateToFilter) {
      const toDate = new Date(this.dateToFilter);
      filtered = filtered.filter(order => new Date(order.order_date) <= toDate);
    }

    this.filteredOrders = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = '';
    this.paymentFilter = '';
    this.dateFromFilter = '';
    this.dateToFilter = '';
    this.filteredOrders = [...this.orders];
    this.currentPage = 1;
    this.updatePagination();
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.paginateData();
  }

  paginateData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
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
