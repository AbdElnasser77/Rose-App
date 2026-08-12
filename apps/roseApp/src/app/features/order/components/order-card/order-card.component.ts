import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { OrderItemComponent } from '../order-item/order-item.component';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-card',
  imports: [TranslatePipe , OrderItemComponent ],  
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
})
export class OrderCardComponent {
  order = input.required<Order>();
}
