import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CircleX, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-payment-cancel',
  imports: [LucideAngularModule, TranslatePipe],
  templateUrl: './payment-cancel.page.html',
  styleUrl: './payment-cancel.page.scss',
})
export class PaymentCancelPage {
  private readonly router = inject(Router);

  readonly CircleX = CircleX;
  continueShopping(): void {
    this.router.navigate(['/products']);
  }
  
  tryAgain(): void {
    this.router.navigate(['/checkout/payment']);
  }
}
