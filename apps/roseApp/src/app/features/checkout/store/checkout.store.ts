import { computed, Injectable, signal } from '@angular/core';
import { CheckoutStateModel } from '../models/checkout-state.model';
import { PaymentMethodType } from '../types/payment-method-type';

@Injectable({
  providedIn: 'root',
})
export class CheckoutStore {
  private readonly state = signal<CheckoutStateModel>({
    addressId: null,
    paymentMethod: null,
    couponCode: null,
    notes: '',
  });


  readonly addressId = computed(() => this.state().addressId);
  readonly paymentMethod = computed(() => this.state().paymentMethod);
  readonly couponCode = computed(() => this.state().couponCode);
  readonly notes = computed(() => this.state().notes);
  readonly checkoutState = computed(() => this.state());


   setAddress(addressId: string): void {
    this.state.update((state) => ({
      ...state,
      addressId,
    }));
  }

  setPaymentMethod(method: PaymentMethodType): void {
    this.state.update((state) => ({
      ...state,
      paymentMethod: method,
    }));
  }

  setCoupon(code: string | null): void {
    this.state.update((state) => ({
      ...state,
      couponCode: code,
    }));
  }

  setNotes(notes: string): void {
    this.state.update((state) => ({
      ...state,
      notes,
    }));
  }

  clear(): void {
    this.state.set({
      addressId: null,
      paymentMethod: null,
      couponCode: null,
      notes: '',
    });
  }
}
