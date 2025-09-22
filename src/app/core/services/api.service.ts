import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Address } from 'src/app/shared/models/address.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ───────────────────────────────────────────────
  // ✅ GENERIC HTTP METHODS
  // ───────────────────────────────────────────────

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`);
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, body);
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`);
  }

  // ───────────────────────────────────────────────
  // ✅ PRODUCT API METHODS
  // ───────────────────────────────────────────────

  getProducts() {
    return this.get(API_ENDPOINTS.PRODUCTS.BASE);
  }

  getProductById(id: number) {
    return this.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`);
  }

  searchProducts(query: string) {
    return this.get(`${API_ENDPOINTS.PRODUCTS.SEARCH}${query}`);
  }

  // ───────────────────────────────────────────────
  // ✅ ORDER API METHODS
  // ───────────────────────────────────────────────

  getOrders() {
    return this.get(API_ENDPOINTS.ORDERS.BASE);
  }

  getUserOrders(userId: number) {
    return this.get(`${API_ENDPOINTS.ORDERS.USER_ORDERS}${userId}`);
  }

  // ───────────────────────────────────────────────
  // ✅ ADDRESS API METHODS
  // ───────────────────────────────────────────────

  getUserAddresses(userId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}/addresses?userId=${userId}`);
  }

  addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(`${this.apiUrl}/addresses`, address);
  }

  updateAddress(address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}/addresses/${address.id}`, address);
  }

  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/addresses/${id}`);
  }
}
