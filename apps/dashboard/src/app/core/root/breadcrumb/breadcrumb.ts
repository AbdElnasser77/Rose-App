import { Component, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthFacade, AuthStore } from '@org/auth';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AssetUrlPipe } from '../../pipes/asset-url.pipe';

export interface IBreadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink , TranslatePipe, MenuModule, ButtonModule, AssetUrlPipe],
  templateUrl: './breadcrumb.html'
})
export class Breadcrumb {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  activeMenuId = signal<string | null>(null);
  private readonly authFacade = inject(AuthFacade);  
  private readonly translate = inject(TranslateService);
  private readonly authStore = inject(AuthStore);
  readonly currentUser = this.authStore.user;

  breadcrumbs = signal<IBreadcrumb[]>([]);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => {
      this.breadcrumbs.set(this.buildBreadcrumb(this.activatedRoute.root));
    });

    this.breadcrumbs.set(this.buildBreadcrumb(this.activatedRoute.root));
  }

  private buildBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    if (breadcrumbs.length === 0) {
      breadcrumbs.push({
        label: 'Dashboard',
        url: '/dashboard' 
      });
    }

    const children: ActivatedRoute[] = route.children;

    if (!children || children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const urlSegments = child.snapshot?.url;
      const routeURL: string = urlSegments ? urlSegments.map(segment => segment.path).join('/') : '';

      let nextUrl = url;
      if (routeURL !== '') {
        nextUrl += `/${routeURL}`;
      }

      const label = child.snapshot?.data?.['breadcrumb'];
      if (label && label !== 'Dashboard') {
        const exists = breadcrumbs.some(b => b.url === nextUrl && b.label === label);
        if (!exists) {
          breadcrumbs.push({ label, url: nextUrl });
        }
      }

      return this.buildBreadcrumb(child, nextUrl, breadcrumbs);
    }

    return breadcrumbs;
  }

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