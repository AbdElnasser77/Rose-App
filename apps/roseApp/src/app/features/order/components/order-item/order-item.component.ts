import { Component, input } from '@angular/core';
import { OrderItem } from '../../models/order.model';
import { LucideAngularModule, Star } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-order-item',
  imports: [LucideAngularModule,TranslatePipe],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
})
export class OrderItemComponent {
  orderItem = input.required<OrderItem>();

  readonly Star = Star;
}
