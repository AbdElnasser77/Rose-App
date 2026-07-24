import { Component, computed, inject, input,output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, TicketPercent ,MoveRight} from 'lucide-angular';
import { CouponModel } from '../../models/coupon.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-order-summary',
  imports: [FormsModule , LucideAngularModule,
    TranslatePipe ,CommonModule
  ],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
})
export class OrderSummaryComponent {
    private readonly _translateService = inject(TranslateService);
   
   appliedCoupon  = input<CouponModel | null>(null);
   subtotal = input.required<number>();
   total = input.required<number>();
   cartHasItems = input.required<boolean>();
   showCheckoutButton = input<boolean>(false);

   applyCouponClicked = output<string>();
   checkoutClicked = output<void>();
 

   readonly isRtl = computed(() => this._translateService.currentLang() === 'ar');

   readonly TicketPercent=TicketPercent;
   readonly MoveRight = MoveRight;
   couponCode = '';
   
   onApplyCoupon(): void {
  const couponCode = this.couponCode.trim();

  if (!couponCode) return;

  this.applyCouponClicked.emit(couponCode);
  }

  onCheckout(): void {
  this.checkoutClicked.emit();
  }

}
