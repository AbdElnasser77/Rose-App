import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, CircleX } from 'lucide-angular';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-payment-failed-modal',
  imports: [LucideAngularModule , DialogModule, TranslatePipe],
  templateUrl: './payment-failed-modal.component.html',
  styleUrl: './payment-failed-modal.component.scss',
})
export class PaymentFailedModalComponent {
  readonly CircleX = CircleX;

  visible = input(false);

  tryAgainClicked = output();
  backToCheckoutClicked = output();

  onTryAgain() {
    this.tryAgainClicked.emit();
  }

  onBackToCheckout() {
    this.backToCheckoutClicked.emit();
  }
}
