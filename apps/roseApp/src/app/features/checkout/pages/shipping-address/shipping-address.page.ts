import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '@org/ui';
import { LoaderService } from '@org/shared-util-loader';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, Phone, ArrowRight } from 'lucide-angular';
import { AddressModalService } from '../../services/address-modal.service';
import { AddressStore } from '../../store/address.store';

@Component({
  selector: 'app-shipping-address',
  imports: [
    CommonModule,
    ButtonComponent,
    LucideAngularModule,
    TranslatePipe,
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

  readonly Phone = Phone;
  readonly ArrowRight = ArrowRight;
  readonly isRtl = computed(() => this.translateService.currentLang() === 'ar');

  readonly addresses = this.addressStore.addresses;
  readonly selectedId = signal<string | null>(null);

  constructor() {
    // Fall back to the default address whenever the current pick is gone - on first
    // load, and again if it gets deleted from the addresses modal.
    effect(() => {
      const addresses = this.addressStore.addresses();
      const selected = untracked(this.selectedId);
      if (selected && addresses.some((address) => address.id === selected)) {
        return;
      }
      this.selectedId.set(this.addressStore.deliveryAddress()?.id ?? null);
    });
  }

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
    this.selectedId.set(id);
  }

  openAddressModal(): void {
    this.addressModal.open();
  }

  onNext(): void {
    if (!this.selectedId()) return;
    this.router.navigate(['/checkout/payment']);
  }
}
