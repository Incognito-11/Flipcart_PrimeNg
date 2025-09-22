// Angular and PrimeNG core imports
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';

// Models and services
import { Order } from 'src/app/shared/models/order.model';
import { ApiService } from 'src/app/core/services/api.service';
import { Orderstatus } from 'src/app/shared/models/order-status.enum';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
  providers: [ConfirmationService, MessageService] // Scoped service providers
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];              // Stores fetched orders
  loading = false;                   // Controls loading spinner

  // Dropdown options for status update
  statusOptions = Object.values(Orderstatus).map(status => ({
    label: status,
    value: status
  }));

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  /**
   * Lifecycle hook - fetch orders on component initialization
   */
  ngOnInit(): void {
    this.loadOrders();
  }

  /**
   * Fetches all orders from backend
   */
  loadOrders(): void {
    this.loading = true;

    this.apiService.get<Order[]>('/orders?_expand=user')
      .pipe(finalize(() => this.loading = false)) // Always stop loading
      .subscribe({
        next: (orders) => this.orders = orders,
        error: (error) => {
          console.error('Failed to load orders', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load orders'
          });
        }
      });
  }

  /**
   * Sends updated order object to backend
   * @param order Updated order object with new status
   */
  updateOrderStatus(order: Order): void {
    this.apiService.put(`/orders/${order.id}`, order)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order status updated'
          });
        },
        error: (error) => {
          console.error('Failed to update order', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update order status'
          });
        }
      });
  }

  /**
   * Opens confirmation popup before deletion
   * @param order Order to be deleted
   */
  confirmDelete(order: Order): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete order #${order.id}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteOrder(order)
    });
  }

  /**
   * Deletes the order and removes it from the list
   * @param order Order to delete
   */
  deleteOrder(order: Order): void {
    this.apiService.delete(`/orders/${order.id}`)
      .subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o.id !== order.id); // Remove from local list
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Order deleted successfully'
          });
        },
        error: (error) => {
          console.error('Delete failed', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete order'
          });
        }
      });
  }

  /**
   * Returns a CSS class name based on the order status
   * @param status Current status of the order
   */
  getStatusBadgeClass(status: Orderstatus): string {
    const statusClassMap: Record<Orderstatus, string> = {
      [Orderstatus.Pending]: 'badge-pending',
      [Orderstatus.Processing]: 'badge-processing',
      [Orderstatus.Shipped]: 'badge-shipped',
      [Orderstatus.Delivered]: 'badge-delivered',
      [Orderstatus.Cancelled]: 'badge-cancelled'
    };

    return statusClassMap[status] || 'badge-pending'; // Default fallback
  }
}
