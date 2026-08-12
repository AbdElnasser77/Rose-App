import { Pipe, PipeTransform } from '@angular/core';
import { BadgeConfigModel } from '../models/badge-config.model';
export interface PaymentStatusOrder {
  paymentStatus: string;
  paymentMethod: string;
}

@Pipe({
  name: 'paymentStatus',
})
export class PaymentStatusPipe implements PipeTransform {
  transform(order :PaymentStatusOrder): BadgeConfigModel {
    switch (order.paymentStatus) {
      case 'SUCCEEDED':
        return {
          text: 'ORDERS.BADGES.PAID',
          variant: 'success',
        };

      case 'CANCELED':
      case 'FAILED':
        return {
          text:'ORDERS.BADGES.CANCELED',
          variant: 'danger',
        };

      case 'PENDING':
        return {
          text: 'ORDERS.BADGES.PENDING',
          variant: 'info',
        };

      default:
        return {
          text: order.paymentStatus,
          variant: 'subtle',
        };
    }
  }
}
