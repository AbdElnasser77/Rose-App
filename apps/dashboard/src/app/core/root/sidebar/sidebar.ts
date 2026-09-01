import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthFacade, AuthStore } from '@org/auth';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

export interface NavItem {
  label: string;
  route: string;
  type: 'path' | 'custom';
  pathD?: string;
  customPaths?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe, RouterOutlet, MenuModule, ButtonModule],
  templateUrl: './sidebar.html'
})
export class Sidebar {
  private readonly authStore = inject(AuthStore);
  readonly currentUser = this.authStore.user;
  private readonly translate = inject(TranslateService);
  activeMenuId = signal<string | null>(null);
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  readonly navItems = signal<NavItem[]>([
    {
      label: 'nav.overview',
      route: '/overview',
      type: 'custom',
      customPaths: [
        'M9.375 3.125H4.16667C3.59137 3.125 3.125 3.59137 3.125 4.16667V11.4583C3.125 12.0336 3.59137 12.5 4.16667 12.5H9.375C9.9503 12.5 10.4167 12.0336 10.4167 11.4583V4.16667C10.4167 3.59137 9.9503 3.125 9.375 3.125Z',
        'M20.8333 3.125H15.625C15.0497 3.125 14.5833 3.59137 14.5833 4.16667V7.29167C14.5833 7.86696 15.0497 8.33333 15.625 8.33333H20.8333C21.4086 8.33333 21.875 7.86696 21.875 7.29167V4.16667C21.875 3.59137 21.4086 3.125 20.8333 3.125Z',
        'M20.8333 12.5H15.625C15.0497 12.5 14.5833 12.9664 14.5833 13.5417V20.8333C14.5833 21.4086 15.0497 21.875 15.625 21.875H20.8333C21.4086 21.875 21.875 20.8333 21.875 20.8333V13.5417C21.875 12.9664 21.4086 12.5 20.8333 12.5Z',
        'M9.375 16.6667H4.16667C3.59137 16.6667 3.125 17.133 3.125 17.7083V20.8333C3.125 21.4086 3.59137 21.875 4.16667 21.875H9.375C9.9503 21.875 10.4167 21.4086 10.4167 20.8333V17.7083C10.4167 17.133 9.9503 16.6667 9.375 16.6667Z'
      ]
    },
    {
      label: 'nav.categories',
      route: '/categories',
      type: 'custom',
      customPaths: [
        'M16.6665 4.16666H18.7498C19.3024 4.16666 19.8323 4.38615 20.223 4.77686C20.6137 5.16756 20.8332 5.69746 20.8332 6.24999V20.8333C20.8332 21.3859 20.6137 21.9158 20.223 22.3065C19.8323 22.6972 19.3024 22.9167 18.7498 22.9167H6.24984C5.6973 22.9167 5.1674 22.6972 4.7767 22.3065C4.386 21.9158 4.1665 21.3859 4.1665 20.8333V6.24999C4.1665 5.69746 4.386 5.16756 4.7767 4.77686C5.1674 4.38615 5.6973 4.16666 6.24984 4.16666H8.33317M12.4998 11.4583H16.6665M12.4998 16.6667H16.6665M8.33317 11.4583H8.34317M8.33317 16.6667H8.34317M9.37484 2.08333H15.6248C16.2001 2.08333 16.6665 2.5497 16.6665 3.12499V5.20833C16.6665 5.78362 16.2001 6.24999 15.6248 6.24999H9.37484C8.79954 6.24999 8.33317 5.78362 8.33317 5.20833V3.12499C8.33317 2.5497 8.79954 2.08333 9.37484 2.08333Z'
      ]
    },
    {
      label: 'nav.occasions',
      route: '/occasions',
      type: 'custom',
      customPaths: [
        'M3.125 10.4167H21.875V6.25C21.875 5.69747 21.6555 5.16756 21.2648 4.77686C20.8741 4.38616 20.3442 4.16667 19.7917 4.16667H5.20833C4.6558 4.16667 4.12589 4.38616 3.73519 4.77686C3.34449 5.16756 3.125 5.69747 3.125 6.25V20.8333C3.125 21.3859 3.34449 21.9158 3.73519 22.3065C4.12589 22.6972 4.6558 22.9167 5.20833 22.9167H12.5M8.33333 2.08334V6.25M16.6667 2.08334V6.25M22.1771 15.3125C21.8221 14.9593 21.3704 14.7193 20.879 14.6229C20.3877 14.5265 19.8788 14.578 19.4167 14.7708C19.1042 14.8958 18.8229 15.0833 18.5833 15.3229L18.2292 15.6771L17.8646 15.3229C17.5108 14.968 17.0596 14.726 16.5682 14.6277C16.0768 14.5295 15.5673 14.5793 15.1042 14.7708C14.7917 14.8958 14.5208 15.0833 14.2812 15.3229C13.2917 16.3021 13.2396 17.9583 14.4896 19.2188L18.2292 22.9167L21.9792 19.2188C23.2292 17.9583 23.1667 16.3021 22.1771 15.3229V15.3125Z'
      ]
    },
    {
      label: 'nav.products',
      route: '/products',
      type: 'custom',
      customPaths: [
        'M12.5 22.9167V12.5M12.5 12.5L3.42708 7.29167M12.5 12.5L21.5729 7.29167M7.8125 4.44792L17.1875 9.8125M11.4583 22.6354C11.775 22.8183 12.1343 22.9145 12.5 22.9145C12.8657 22.9145 13.225 22.9145 13.5417 22.6354L20.8333 18.4687C21.1497 18.2861 21.4125 18.0234 21.5954 17.7071C21.7782 17.3908 21.8746 17.032 21.875 16.6667V8.33333C21.8746 7.96799 21.7782 7.60918 21.5954 7.29288C21.4125 6.97658 21.1497 6.71392 20.8333 6.53125L13.5417 2.36458C13.225 2.18173 12.8657 2.08547 12.5 2.08547C12.1343 2.08547 11.775 2.18173 11.4583 2.36458L4.16667 6.53125C3.85027 6.71392 3.58748 6.97658 3.40465 7.29288C3.22182 7.60918 3.12537 7.96799 3.125 8.33333V16.6667C3.12537 17.032 3.22182 17.3908 3.40465 17.7071C3.58748 18.0234 3.85027 18.2861 4.16667 18.4687L11.4583 22.6354Z'
      ]
    }
  ]);

  getMenuItems(): MenuItem[] {
    return [
      {
        label: this.currentUser()?.username,
        style: {
          paddingBottom: '10px',
        },
      },
      {
        label: this.translate.instant('NAV.ACCOUNT'),
        icon: 'pi pi-user',
        style: {
          paddingTop: '10px',
          paddingBottom: '10px',
          borderTop: '1px solid #E5E7EB'
        },
        command: () => this.goToAccount()
      },
      {
        label: this.translate.instant('NAV.LOGOUT'),
        icon: 'pi pi-sign-out',
        style: {
          paddingTop: '10px',
          paddingBottom: '10px',
          borderTop: '1px solid #E5E7EB'
        },
        command: () => this.logout()
      }
    ];
  }

  @HostListener('document:click')
   closeMenus(): void {
    this.activeMenuId.set(null);
  }

  logout(): void {
    this.authFacade.logout();
    this.activeMenuId.set(null);
    this.router.navigate(['/auth']);
  }

   goToAccount(): void {
    this.activeMenuId.set(null);
    this.router.navigate(['/account/profile']);
  }
}