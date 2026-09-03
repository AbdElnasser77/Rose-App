import { Component, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CircleX, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-payment-failed-modal',
  imports: [LucideAngularModule, TranslatePipe],
  templateUrl: './payment-failed-modal.component.html',
  styleUrl: './payment-failed-modal.component.scss',
})
export class PaymentFailedModalComponent {
  tryAgain = output<void>();
  continueShopping = output<void>();

  readonly CircleX = CircleX;
}
