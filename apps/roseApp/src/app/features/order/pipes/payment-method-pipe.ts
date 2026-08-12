import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentMethod',
})
export class PaymentMethodPipe implements PipeTransform {
  transform(method: string): string {
    
    switch (method) {
      case 'CREDIT_CARD':
        return 'ORDERS.METHODS.CREDIT_CARD';

      case 'CASH_ON_DELIVERY':
        return 'ORDERS.METHODS.CASH';

      default:
        return method;
    }
  }
}
