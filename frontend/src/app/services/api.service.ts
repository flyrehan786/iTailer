import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Customer APIs
  getAllCustomers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/customers`);
  }

  getCustomerById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/customers/${id}`);
  }

  createCustomer(customer: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customers`, customer);
  }

  updateCustomer(id: number, customer: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/customers/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/customers/${id}`);
  }

  searchCustomers(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/customers/search?q=${query}`);
  }

  // Measurement APIs
  getMeasurementsByCustomer(customerId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/measurements/customer/${customerId}`);
  }

  getMeasurementById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/measurements/${id}`);
  }

  createMeasurement(measurement: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/measurements`, measurement);
  }

  updateMeasurement(id: number, measurement: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/measurements/${id}`, measurement);
  }

  deleteMeasurement(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/measurements/${id}`);
  }

  // Order APIs
  getAllOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders`);
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/${id}`);
  }

  getOrdersByCustomer(customerId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/customer/${customerId}`);
  }

  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders`, order);
  }

  updateOrder(id: number, order: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${id}`, order);
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/orders/${id}/status`, { status });
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/orders/${id}`);
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/stats`);
  }

  // Payment APIs
  getPaymentsByOrder(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/payments/order/${orderId}`);
  }

  createPayment(payment: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/payments`, payment);
  }

  deletePayment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/payments/${id}`);
  }

  // User Profile APIs
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/profile`);
  }

  updateUserProfile(profile: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/profile`, profile);
  }

  changePassword(passwordData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/change-password`, passwordData);
  }
}
