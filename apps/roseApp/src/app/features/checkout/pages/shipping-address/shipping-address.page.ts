import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '@org/ui';
import { LucideAngularModule, Phone, ArrowRight } from 'lucide-angular';
import { Address } from '../../models/address.model';
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
export class ShippingAddressPage {
  private readonly router = inject(Router);

  readonly Phone = Phone;
  readonly ArrowRight = ArrowRight;

  readonly addresses = signal<Address[]>([
    {
      id: '1',
      city: 'Giza',
      street: '21 Ahmed Mohamed St., King Faisal St., Giza',
      phone: '+201012346578',
    },
    {
      id: '2',
      city: 'Cairo',
      street: '14 Omar Ibn Akhatab St., Ramsis St., Cairo',
      phone: '+201112345678',
    },
    {
      id: '3',
      city: 'Alexandria',
      street: '16 El-Gaish Rd, San Stefano, El-Raml 2, Alexandria',
      phone: '+201512345678',
    },
    {
      id: '4',
      city: 'Giza',
      street: '5 Hassan Mohamed St., Dokki, Giza',
      phone: '+201098765432',
    },
  ]);

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
