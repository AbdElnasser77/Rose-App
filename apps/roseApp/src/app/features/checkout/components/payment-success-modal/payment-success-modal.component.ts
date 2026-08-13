import { Component, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { LucideAngularModule, CircleCheck } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-payment-success-modal',
  imports: [DialogModule , LucideAngularModule , TranslatePipe],
  templateUrl: './payment-success-modal.component.html',
  styleUrl: './payment-success-modal.component.scss',
})
export class PaymentSuccessModalComponent {
  readonly CircleCheck = CircleCheck ;

  visible = input(false);
  continueShoppingClicked = output<void>();
   viewOrdersClicked = output<void>();

  onContinueShopping(){
    this.continueShoppingClicked.emit();
  }

  onViewOrders(){
    this.viewOrdersClicked.emit();
  }
}
