import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { OrderService } from '../../services/order.service';
import { Order, OrderItem } from '../../models/order.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-order',
  imports: [CommonModule, TagModule, ButtonModule, DatePipe, CurrencyPipe, TranslatePipe],
  templateUrl: './order.page.html'
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService);
  orders = signal<Order[]>([]);
  loading = signal<boolean>(true);
  
  expandedOrders = signal<Record<string, boolean>>({});

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggleExpand(orderId: string): void {
    this.expandedOrders.update(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  }

  isExpanded(orderId: string): boolean {
    return !!this.expandedOrders()[orderId];
  }

  getVisibleItems(order: Order): OrderItem[] {
    if (this.isExpanded(order.id) || order.orderItems.length <= 2) {
      return order.orderItems;
    }
    return order.orderItems.slice(0, 4);
  }

  getPaymentBadgeSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
    switch (status) {
      case 'SUCCEEDED': return 'success';
      case 'PENDING': return 'warn';
      case 'FAILED': return 'danger';
      default: return 'info';
    }
  }

  getStatusBadgeSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'DONE': return 'success';
      case 'PENDING': return 'info';
      case 'IN_PROGRESS': return 'info';
      case 'CANCELED': return 'danger';
      default: return 'info';
    }
  }
}
