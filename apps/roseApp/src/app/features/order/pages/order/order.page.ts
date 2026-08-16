import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { OrderService } from '../../services/order.service';
import { Order} from '../../models/order.model';
import { TranslatePipe } from '@ngx-translate/core';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '@org/ui';

@Component({
  selector: 'app-order',
  imports: [CommonModule, TagModule , ButtonModule, TranslatePipe
    , OrderCardComponent ,PaginationComponent],
  templateUrl: './order.page.html'  
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService);
   private destroyRef = inject(DestroyRef);
   
  orders = signal<Order[]>([]);
  page = signal<number>(1);
  totalPages = signal<number>(1);
  limit = signal(6);
  totalOrders = signal(0);

  loading = signal<boolean>(true);
  
  

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(){
    this.orderService.getOrders(this.page(), this.limit())
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.orders.set(data.payload.data);
        

         this.page.set(data.payload.metadata.page);
          this.limit.set(data.payload.metadata.limit);
          this.totalPages.set(data.payload.metadata.totalPages);
          this.totalOrders.set(data.payload.metadata.total);

          this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  

   onPageChange(page: number): void {
    this.page.set(page);
    this. getOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

 

  

  
}
