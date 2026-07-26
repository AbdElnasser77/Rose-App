import { Component, computed, inject, input,output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, TicketPercent ,MoveRight} from 'lucide-angular';
import { ButtonComponent } from '@org/ui';
import { CouponModel } from '../../models/coupon.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-order-summary',
  imports: [FormsModule , LucideAngularModule,
    TranslatePipe ,CommonModule, ButtonComponent
  ],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
})
export class OrderSummaryComponent {
    private readonly _translateService = inject(TranslateService);
   
  readonly appliedCoupon  = input<CouponModel | null>(null);
  readonly subtotal = input.required<number>();
  readonly total = input.required<number>();
  readonly cartHasItems = input.required<boolean>();
  readonly discount = input<number>(0);
  readonly showCheckoutButton = input<boolean>(false);
  readonly checkoutDisabled = input(false);

  readonly applyCouponClicked = output<string>();
  readonly checkoutClicked = output<void>();
 

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
