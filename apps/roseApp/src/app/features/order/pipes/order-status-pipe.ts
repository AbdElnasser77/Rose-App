import { Pipe, PipeTransform } from '@angular/core';
import { BadgeConfigModel } from '../models/badge-config.model';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED';

@Pipe({
  name: 'orderStatus',
})
export class OrderStatusPipe implements PipeTransform {
  transform(status : OrderStatus | string):  BadgeConfigModel {
    switch (status) {
      case 'PENDING':
        return {
           text: 'ORDERS.BADGES.IN_PROGRESS',
          variant: 'info',
        };

      case 'CONFIRMED':
        return {
          text: 'ORDERS.BADGES.DONE',
          variant: 'success',
        };

      case 'CANCELED':
        return {
           text: 'ORDERS.BADGES.CANCELED',
          variant: 'danger',
        };

      default:
        return {
          text: status,
          variant: 'subtle',
        };
    }
  }
}
