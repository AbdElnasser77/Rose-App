import { Component, ElementRef, inject, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { OrderItemComponent } from '../order-item/order-item.component';
import { Order, OrderItem } from '../../models/order.model';
import { Banknote, CreditCard, LucideAngularModule ,ChevronDown ,ChevronUp} from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { OrderStatusPipe } from '../../pipes/order-status-pipe';
import { DeliveryStatusPipe } from '../../pipes/delivery-status-pipe';
import { PaymentStatusPipe } from '../../pipes/payment-status-pipe';
import { PaymentMethodPipe } from '../../pipes/payment-method-pipe';
import { LocalizedDatePipe } from '../../pipes/localized-date-pipe';

@Component({
  selector: 'app-order-card',
  imports: [TranslatePipe , OrderItemComponent ,LucideAngularModule 
     ,BadgeComponent ,OrderStatusPipe ,DeliveryStatusPipe ,PaymentStatusPipe 
     ,PaymentMethodPipe ,CommonModule ,LocalizedDatePipe ],  
  templateUrl: './order-card.component.html', 
  styleUrl: './order-card.component.scss',
})
export class OrderCardComponent {
  private elementRef = inject(ElementRef);
  order = input.required<Order>();

  readonly  Banknote = Banknote;
  readonly CreditCard = CreditCard ;
  readonly ChevronDown = ChevronDown ;
  readonly ChevronUp = ChevronUp ;

  expanded = signal(false);

  toggleExpand(): void {
    const wasExpanded = this.expanded();
    
     this.expanded.update(value => !value);

      if (wasExpanded) {
        setTimeout(() => {
      this.elementRef.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
       });
      }
  
 }

 getVisibleItems(): OrderItem[] {
  if (this.expanded() || this.order().orderItems.length <= 4) {
    return this.order().orderItems;
  }

  return this.order().orderItems.slice(0, 4);
 }
}
