import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '@org/ui';
import { LoaderService } from '@org/shared-util-loader';
import { LucideAngularModule, Phone, ArrowRight } from 'lucide-angular';
import { Address } from '../../models/address.model';
import { AddressesApiService } from '../../services/addresses-api.service';
import { OrderSummaryComponent } from '../../../../shared/components/order-summary/order-summary.component';
import { CouponModel } from '../../../../shared/models/coupon.model';

@Component({
  selector: 'app-shipping-address',
  imports: [
    CommonModule,
    ButtonComponent,
    LucideAngularModule,
    OrderSummaryComponent,
  ],
  templateUrl: './shipping-address.page.html',
  styleUrl: './shipping-address.page.scss',
})
export class ShippingAddressPage implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly addressesApi = inject(AddressesApiService);
  private readonly loader = inject(LoaderService);

  readonly Phone = Phone;
  readonly ArrowRight = ArrowRight;

  readonly addresses = signal<Address[]>([]);
  readonly selectedId = signal<string | null>(null);

  readonly subtotal = signal(250);
  readonly appliedCoupon = signal<CouponModel | null>(null);
  readonly total = computed(() => {
    const coupon = this.appliedCoupon();
    if (!coupon) return this.subtotal();
    if (coupon.type === 'PERCENT') {
      return this.subtotal() - (this.subtotal() * Number(coupon.value)) / 100;
    }
    return Math.max(0, this.subtotal() - Number(coupon.value));
  });

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.addressesApi
      .getAddresses()
      .pipe(this.loader.track(), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (addresses) => this.addresses.set(addresses),
        error: () => this.addresses.set([]),
      });
  }

  selectAddress(id: string): void {
    this.selectedId.set(id);
  }

  onApplyCoupon(code: string): void {
    this.appliedCoupon.set({
      id: 'mock',
      code,
      type: 'PERCENT',
      value: '50',
      minPurchase: '0',
      maxDiscount: '0',
      usageLimit: 0,
      usedCount: 0,
      validFrom: '',
      validUntil: '',
      isActive: true,
      immutable: false,
      createdAt: '',
      updatedAt: '',
    });
  }

  onNext(): void {
    if (!this.selectedId()) return;
    this.router.navigate(['/checkout/payment']);
  }
}
