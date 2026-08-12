import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { OrderService } from '../../services/order.service';
import { Order} from '../../models/order.model';
import { TranslatePipe } from '@ngx-translate/core';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-order',
  imports: [CommonModule, TagModule , ButtonModule, TranslatePipe , OrderCardComponent],
  templateUrl: './order.page.html'  
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService);
   private destroyRef = inject(DestroyRef);
   
  orders = signal<Order[]>([]);
  loading = signal<boolean>(true);
  
  

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(){
    this.orderService.getOrders().pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
        this.orders.set(data.payload.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  



 

  

  
}
