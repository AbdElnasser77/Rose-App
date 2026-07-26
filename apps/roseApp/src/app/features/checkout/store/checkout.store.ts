import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  untracked,
} from '@angular/core';
import { CheckoutStateModel } from '../models/checkout-state.model';
import { CreateOrderRequestModel } from '../models/order/create-order-request.model';
import { PaymentMethodType } from '../types/payment-method-type';
import { AddressStore } from './address.store';

const EMPTY_STATE: CheckoutStateModel = {
  addressId: null,
  paymentMethod: null,
  couponCode: null,
  notes: '',
};

@Injectable({
  providedIn: 'root',
})
export class CheckoutStore {
  private readonly _addressStore = inject(AddressStore);

  private readonly state = signal<CheckoutStateModel>({ ...EMPTY_STATE });

  readonly addressId = computed(() => this.state().addressId);
  readonly paymentMethod = computed(() => this.state().paymentMethod);
  readonly couponCode = computed(() => this.state().couponCode);
  readonly notes = computed(() => this.state().notes);

  // The order payload the API expects, or null while the checkout is still incomplete.
  // Assembled here so callers never hand-build a body out of raw state.
  readonly orderRequest = computed<CreateOrderRequestModel | null>(() => {
    const { addressId, paymentMethod, couponCode, notes } = this.state();

    if (!addressId || !paymentMethod) {
      return null;
    }

    return {
      addressId,
      paymentMethod,
      couponCode: couponCode ?? undefined,
      notes: notes || undefined,
    };
  });

  constructor() {
    // Keep the selection valid against the user's real addresses from anywhere in the
    // flow. This cannot live on the shipping page: it is unmounted on the payment step,
    // so a refresh there would leave no address, and deleting the selected address from
    // the navbar modal would leave a dead id that only shows up when the order fails.
    effect(() => {
      const loaded = this._addressStore.loaded();
      const addresses = this._addressStore.addresses();
      const selected = untracked(this.addressId);

      // Before the list arrives every id looks invalid, so acting here would throw away
      // a good selection and snap the user back to their primary address.
      if (!loaded) {
        return;
      }

      if (selected && addresses.some((address) => address.id === selected)) {
        return;
      }

      this.setAddress(this._addressStore.deliveryAddress()?.id ?? null);
    });
  }

  setAddress(addressId: string | null): void {
    this.patch({ addressId });
  }

  setPaymentMethod(method: PaymentMethodType): void {
    this.patch({ paymentMethod: method });
  }

  setCoupon(code: string | null): void {
    this.patch({ couponCode: code });
  }

  setNotes(notes: string): void {
    this.patch({ notes });
  }

  clear(): void {
    this.state.set({ ...EMPTY_STATE });
  }

  private patch(changes: Partial<CheckoutStateModel>): void {
    this.state.update((state) => ({ ...state, ...changes }));
  }
}
