import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '@org/ui';
import { LoaderService } from '@org/shared-util-loader';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, Phone, ArrowRight } from 'lucide-angular';
import { AddressModalService } from '../../services/address-modal.service';
import { AddressStore } from '../../store/address.store';
import { CheckoutStore } from '../../store/checkout.store';
import { CheckoutStepperComponent } from '../../components/checkout-stepper/checkout-stepper.component';

@Component({
  selector: 'app-shipping-address',
  imports: [
    CommonModule,
    ButtonComponent,
    LucideAngularModule,
    TranslatePipe,
    CheckoutStepperComponent,
  ],
  templateUrl: './shipping-address.page.html',
  styleUrl: './shipping-address.page.scss',
})
export class ShippingAddressPage implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly addressStore = inject(AddressStore);
  private readonly loader = inject(LoaderService);
  private readonly translateService = inject(TranslateService);
  private readonly addressModal = inject(AddressModalService);
  private readonly checkoutStore = inject(CheckoutStore);

  readonly Phone = Phone;
  readonly ArrowRight = ArrowRight;
  readonly isRtl = computed(() => this.translateService.currentLang() === 'ar');

  readonly addresses = this.addressStore.addresses;
  // The payment step reads the pick straight off CheckoutStore, so that is the only
  // place it may live - a local copy here would leave the order without an address.
  // CheckoutStore keeps it reconciled against the address list; nothing to do here.
  readonly selectedId = this.checkoutStore.addressId;

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.addressStore
      .load()
      .pipe(this.loader.track(), takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  selectAddress(id: string): void {
    this.checkoutStore.setAddress(id);
  }

  openAddressModal(): void {
    this.addressModal.open();
  }

  onNext(): void {
    const selected = this.selectedId();

    if (!selected) return;

    // Promoting the pick to primary is what makes it outlive a refresh: the navbar and
    // CheckoutStore's fallback both read the primary address, so the server holds the
    // choice rather than this tab.
    this.addressStore.setPrimary(selected);
    this.router.navigate(['/checkout/payment']);
  }
}
