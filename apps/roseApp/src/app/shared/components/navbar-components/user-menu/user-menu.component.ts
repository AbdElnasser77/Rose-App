import { Component, computed, HostListener, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthFacade, AuthStore, SessionService } from '@org/auth';
import { ChevronDown, LogOut, LucideAngularModule, MapPinHouse, ScrollText, Settings, User } from 'lucide-angular';

@Component({
  selector: 'app-user-menu',
  imports: [ LucideAngularModule , TranslatePipe , RouterLink],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent {

  private readonly authStore = inject(AuthStore);
  private readonly sessionService = inject(SessionService);
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  readonly User = User;
  readonly ChevronDown = ChevronDown;
  readonly LogOut = LogOut;

  readonly mobile = input(false);
  readonly isDropdownOpen = signal(false) ;

  readonly currentUser = localStorage.getItem('username'); // temporary for navbar **will be removed**


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
    route: '/account',
    icon: User,
  },
  {
    label: 'NAV.ADDRESSES',
    route: '/addresses',
    icon : MapPinHouse
  },
  {
    label: 'NAV.ORDERS',
    route: '/order',
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
