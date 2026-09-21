import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CircleCheck, LucideAngularModule } from 'lucide-angular';
import { PaymentService } from '../../services/payment.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-payment-success',
  imports: [LucideAngularModule, TranslatePipe],
  templateUrl: './payment-success.page.html',
  styleUrl: './payment-success.page.scss',
})
export class PaymentSuccessPage  implements OnInit{
  private readonly router = inject(Router);
  private readonly _paymentService = inject(PaymentService)
  private readonly destroyRef = inject(DestroyRef);
  private readonly _route = inject(ActivatedRoute);
  readonly CircleCheck = CircleCheck ;
  amountTotal=signal<number | null>(null);
  
  
  ngOnInit(): void {
    const sessionId = this._route.snapshot.queryParamMap.get('session_id');
    if (!sessionId) {
      this.router.navigate(['/checkout/payment']);
      return ;
    }else{
      this.getPaidOrderDetails(sessionId);
    }
   
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  viewOrders(): void {
    this.router.navigate(['/orders']);
  }
   

  getPaidOrderDetails(sessionId: string) {
    this._paymentService.checkCheckoutSession(sessionId).pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next : (response) => {
        const { paymentStatus, order } = response.payload;

        if (
          paymentStatus !== 'paid' ||
          order.paymentStatus !== 'SUCCEEDED'
        ) {
          this.router.navigate(['/checkout/cancel']);
          return;
        }

        this.amountTotal.set(response.payload.amountTotal);
      },
      error: () => {
        this.router.navigate(['/checkout/cancel']);
      },
    })
  }
}
