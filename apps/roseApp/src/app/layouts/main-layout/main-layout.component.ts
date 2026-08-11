import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar-components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { LoaderContainerComponent } from '@org/ui';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';
import { NavigationLoaderService } from '../../core/services/navigation-loader.service';
import { ManageAddressesModalComponent } from '../../features/checkout/components/manage-addresses-modal/manage-addresses-modal.component';
import { AddressModalService } from '../../features/checkout/services/address-modal.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet,NavbarComponent,FooterComponent,LoaderContainerComponent,AssetUrlPipe,ManageAddressesModalComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly _navigationLoader = inject(NavigationLoaderService);
  readonly addressModal = inject(AddressModalService);

  isLoggedIn = false;
}
