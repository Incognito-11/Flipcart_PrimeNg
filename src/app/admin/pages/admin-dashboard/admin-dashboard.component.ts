import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { User } from 'src/app/shared/models/user.model';
import { Product } from 'src/app/shared/models/product.model';
import { Order } from 'src/app/shared/models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  totalUsers = 0;
  totalProducts = 0;
  totalOrders = 0;
  totalRevenue = 0;

  chartData: any;
  chartOptions: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  private loadAllData(): void {
    forkJoin({
      users: this.apiService.get<User[]>('/users'),
      products: this.apiService.get<Product[]>('/products'),
      orders: this.apiService.get<Order[]>('/orders')
    }).subscribe(({ users, products, orders }) => {
      this.totalUsers = users.length;
      this.totalProducts = products.length;
      this.totalOrders = orders.length;
      this.totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

      this.initChart();
    });
  }

  private initChart(): void {
    const labels = this.getPastMonths(7);
    const dataOrders = this.generateChartData(labels.length);
    const dataRevenue = this.generateChartData(labels.length);

    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue('--primary-color');
    const danger = style.getPropertyValue('--danger-color');
    const textColor = style.getPropertyValue('--text-color-secondary');
    const border = style.getPropertyValue('--surface-border');

    this.chartData = {
      labels,
      datasets: [
        { label: 'Orders', data: dataOrders, fill: false, borderColor: primary, tension: 0.4 },
        { label: 'Revenue', data: dataRevenue, fill: false, borderColor: danger, tension: 0.4 }
      ]
    };

    this.chartOptions = {
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: border, drawBorder: false } },
        y: { ticks: { color: textColor }, grid: { color: border, drawBorder: false } }
      }
    };
  }

  private getPastMonths(count: number): string[] {
    const now = new Date();
    const months = [];
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleString('default', { month: 'short' }));
    }
    return months;
  }

  private generateChartData(count: number): number[] {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 100) + 1);
  }
}
