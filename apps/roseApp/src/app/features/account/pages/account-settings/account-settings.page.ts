import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DrawerModule } from 'primeng/drawer';
import { LucideAngularModule, Menu } from 'lucide-angular';
import { AccountSidebarComponent } from '../../components/account-sidebar/account-sidebar.component';

@Component({
  selector: 'app-account-settings',
  imports: [
    RouterOutlet,
    TranslatePipe,
    DrawerModule,
    LucideAngularModule,
    AccountSidebarComponent,
  ],
  templateUrl: './account-settings.page.html',
  styleUrl: './account-settings.page.scss',
})
export class AccountSettingsPage {
  private readonly translate = inject(TranslateService);

  readonly Menu = Menu;

  readonly menuOpen = signal(false);

  readonly drawerPosition = computed<'left' | 'right'>(() =>
    this.translate.currentLang() === 'ar' ? 'right' : 'left'
  );
}
