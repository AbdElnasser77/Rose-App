import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthFacade } from '@org/auth';
import { ButtonComponent } from '@org/ui';
import { LucideAngularModule, Lock, LogOut, UserPen } from 'lucide-angular';

@Component({
  selector: 'app-account-sidebar',
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    LucideAngularModule,
    ButtonComponent,
  ],
  templateUrl: './account-sidebar.component.html',
  styleUrl: './account-sidebar.component.scss',
})
export class AccountSidebarComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly UserPen = UserPen;
  readonly Lock = Lock;
  readonly LogOut = LogOut;

  readonly isRtl = computed(() => this.translate.currentLang() === 'ar');

  // Swapped wholesale rather than layered with an important modifier: Tailwind v4
  // moved that to a suffix, and utilities that collide resolve by source order.
  readonly activeItemClass =
    'bg-zinc-900 text-white dark:bg-soft-pink-300 dark:text-zinc-900';
  readonly idleItemClass =
    'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700';

  logout(): void {
    this.authFacade.logout();
    this.router.navigate(['/auth']);
  }
}
