import { Component, computed, inject, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore, SessionService } from '@org/auth';
import { AddressStore } from '../../../../features/checkout/store/address.store';
import { LucideAngularModule, MapPin, MapPinPlus } from 'lucide-angular';

@Component({
  selector: 'app-delivery-address',
  imports: [LucideAngularModule ,TranslatePipe],
  templateUrl: './delivery-address.component.html',
  styleUrl: './delivery-address.component.scss',
})
export class DeliveryAddressComponent {
  private readonly authStore = inject(AuthStore);
  private readonly sessionService = inject(SessionService);
  private readonly addressStore = inject(AddressStore);
  
  readonly addressClicked = output<void>();
  readonly MapPin = MapPin;
  readonly MapPinPlus = MapPinPlus;

  readonly deliveryAddress = this.addressStore.deliveryAddress;
  readonly isLoggedIn = computed(
      () => this.authStore.isAuthenticated() || this.sessionService.isAuthenticated()
    );

  onAddressClick(): void {
  this.addressClicked.emit();
 }
}
