import { Pipe, PipeTransform } from '@angular/core';
import { DeliveryStatusConfigModel } from '../models/delivery-status-config.model';
import { CheckCheck, TriangleAlert, Truck } from 'lucide-angular';

@Pipe({
  name: 'deliveryStatus',
})
export class DeliveryStatusPipe implements PipeTransform {
  transform(status: string): DeliveryStatusConfigModel {
    switch (status) {
      case 'PENDING':
        return {
           text: 'ORDERS.DELIVERY.PENDING',
          color: 'text-[#CA8A04] dark:text-[#FACC15]',
          icon :Truck 
        };

      case 'CONFIRMED':
        return {
          text: 'ORDERS.DELIVERY.DELIVERED',
          color: 'text-[#009966] dark:text-[#34D399]',
          icon :CheckCheck
        };

      case 'CANCELED':
        return {
          text: 'ORDERS.DELIVERY.CANCELED',
          color: 'text-[#CD2E33] dark:text-[#F87171]',
          icon :TriangleAlert
        };

      default:
        return {
          text: status,
          color: 'text-[#CA8A04]',
          icon :Truck 
        };
    }
  }
}
