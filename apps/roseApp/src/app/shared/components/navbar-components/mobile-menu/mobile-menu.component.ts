import { Component, computed, DestroyRef,  inject, signal } from '@angular/core';
import { LucideAngularModule, User } from 'lucide-angular';
import { MainNavLinksComponent } from '../main-nav-links/main-nav-links.component';
import { AuthStore, SessionService } from '@org/auth';
import { DrawerModule } from 'primeng/drawer';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-mobile-menu',
  imports: [ LucideAngularModule,MainNavLinksComponent 
    ,DrawerModule ,UserMenuComponent ,TranslatePipe],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
})
export class MobileMenuComponent {
   private readonly authStore = inject(AuthStore);
   private readonly sessionService = inject(SessionService);
   private readonly translateService = inject(TranslateService);
   private readonly router = inject(Router);
   private readonly destroyRef = inject(DestroyRef);


  constructor() {
  this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(() => {
      this.isVisible.set(false);
    });
  }
   readonly User =User;
   readonly currentUser = localStorage.getItem('username'); // temporary for navbar **will be removed**

   readonly isVisible = signal(false);
   readonly isRtl = computed(() => (this.translateService.currentLang()) === 'ar');
   readonly isLoggedIn = computed(
    () =>
      this.authStore.isAuthenticated() ||
      this.sessionService.isAuthenticated()
  );

  
 
  openMenu(): void {
  this.isVisible.set(true);
  }

  closeMenu(): void {
  this.isVisible.set(false);
  }

 
}
