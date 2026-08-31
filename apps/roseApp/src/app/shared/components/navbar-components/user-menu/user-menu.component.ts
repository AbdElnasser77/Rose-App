import { Component, computed, HostListener, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthFacade, AuthStore, SessionService } from '@org/auth';
import { AddressModalService } from '../../../../features/checkout/services/address-modal.service';
import { ChevronDown, LogOut, LucideAngularModule, MapPinHouse, 
  ScrollText, Settings, User ,Moon ,Globe} from 'lucide-angular';
import { ThemeToggleComponent } from '@rose/theme';
import { LanguageSwitcherComponent } from '@rose/i18n';

@Component({
  selector: 'app-user-menu',
  imports: [ LucideAngularModule , TranslatePipe ,
     RouterLink  , ThemeToggleComponent , LanguageSwitcherComponent],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent {

  private readonly authStore = inject(AuthStore);
  private readonly sessionService = inject(SessionService);
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);
  private readonly addressModal = inject(AddressModalService);

  readonly User = User;
  readonly ChevronDown = ChevronDown;
  readonly LogOut = LogOut;
  readonly Moon = Moon;
  readonly Globe = Globe;

  readonly currentUser = this.authStore.user;
  readonly mobile = input(false);
  readonly isDropdownOpen = signal(false) ;



   readonly isLoggedIn = computed(
    () => this.authStore.isAuthenticated() || this.sessionService.isAuthenticated()
  );

   // Close dropdown when clicking outside user menu container
    @HostListener('document:click',['$event'])
    onDocumentClick(event :MouseEvent):void{

      if (this.mobile()) {
         return;
        }
        const target = event.target as HTMLElement;
  
        if (!target.closest('.user-menu-container')) {
         this.closeDropdown();
        }
    }
   
  readonly menuItems = [
  {
    label: 'NAV.ACCOUNT',
    route: '/account' as string | null,
    icon: User,
  },
  {
    label: 'NAV.ADDRESSES',
    route: null,
    icon : MapPinHouse
  },
  {
    label: 'NAV.ORDERS',
    route: '/orders',
    icon : ScrollText
  },
  {
    label: 'NAV.DASHBOARD',
    route: '/dashboard',
    icon : Settings  
  },
  ];

  closeDropdown(): void {
  this.isDropdownOpen.set(false);
  }

  openAddresses(): void {
    this.closeDropdown();
    this.addressModal.open();
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update(isOpen => !isOpen);
  }

  

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

   logout(): void {
    this.authFacade.logout();
    this.closeDropdown();
    this.router.navigate(['/auth']);
  }

  
}
