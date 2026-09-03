import { Component,  output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CircleCheck, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-payment-success-modal',
  imports: [LucideAngularModule, TranslatePipe],
  templateUrl: './payment-success-modal.component.html',
  styleUrl: './payment-success-modal.component.scss',
})
export class PaymentSuccessModalComponent {
  
  viewOrders = output<void>();
  continueShopping = output<void>();

  readonly CircleCheck = CircleCheck;
}
