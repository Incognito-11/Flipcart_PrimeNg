import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { Order } from 'src/app/shared/models/order.model';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
  userStats: {
    totalOrders?: number;
    wishlistItems?: number;
    savedAddresses?: number;
  } = {};

  recentOrders: Order[] = [];
  loading = false;
  username: string = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.username = currentUser.username;
      this.loadUserData(currentUser.id);
    } else {
      this.toastService.showError('User not logged in');
      this.router.navigate(['/login']);
    }
  }

  loadUserData(userId: number): void {
    this.loading = true;

    this.apiService
      .get<{
        totalOrders: number;
        wishlistItems: number;
        savedAddresses: number;
      }>(`/users/${userId}/stats`)
      .subscribe({
        next: (stats) => {
          this.userStats = stats;
          this.loadRecentOrders(userId);
        },
        error: () => {
          this.toastService.showError('Failed to load user data');
          this.loading = false;
        },
      });
  }

  loadRecentOrders(userId: number): void {
    this.apiService
      .get<Order[]>(
        `/orders?userId=${userId}&_sort=orderDate&_order=desc&_limit=3`
      )
      .subscribe({
        next: (orders) => {
          this.recentOrders = orders;
          this.loading = false;
        },
        error: () => {
          this.toastService.showError('Failed to load recent orders');
          this.loading = false;
        },
      });
  }

  getStatusSeverity(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  logout(): void {
    this.authService.logout();
    this.toastService.showSuccess('Logged out successfully');
    this.router.navigate(['auth/login']);
  }
}
