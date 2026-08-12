import { Component, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { OrderItemComponent } from '../order-item/order-item.component';
import { Order, OrderItem } from '../../models/order.model';
import { Banknote, CreditCard, LucideAngularModule ,ChevronDown ,ChevronUp} from 'lucide-angular';
import { CommonModule, DatePipe } from '@angular/common';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { OrderStatusPipe } from '../../pipes/order-status-pipe';
import { DeliveryStatusPipe } from '../../pipes/delivery-status-pipe';
import { PaymentStatusPipe } from '../../pipes/payment-status-pipe';
import { PaymentMethodPipe } from '../../pipes/payment-method-pipe';

@Component({
  selector: 'app-order-card',
  imports: [TranslatePipe , OrderItemComponent ,LucideAngularModule ,DatePipe
     ,BadgeComponent ,OrderStatusPipe ,DeliveryStatusPipe ,PaymentStatusPipe 
     ,PaymentMethodPipe ,CommonModule],  
  templateUrl: './order-card.component.html', 
  styleUrl: './order-card.component.scss',
})
export class OrderCardComponent {
  order = input.required<Order>();

  readonly  Banknote = Banknote;
  readonly CreditCard = CreditCard ;
  readonly ChevronDown = ChevronDown ;
  readonly ChevronUp = ChevronUp ;

  expanded = signal(false);

  toggleExpand(): void {
  this.expanded.update(value => !value);
 }

 getVisibleItems(): OrderItem[] {
  if (this.expanded() || this.order().orderItems.length <= 4) {
    return this.order().orderItems;
  }

  return this.order().orderItems.slice(0, 4);
 }
}
