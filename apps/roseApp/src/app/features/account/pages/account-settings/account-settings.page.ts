import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountSidebarComponent } from '../../components/account-sidebar/account-sidebar.component';

@Component({
  selector: 'app-account-settings',
  imports: [RouterOutlet, TranslatePipe, AccountSidebarComponent],
  templateUrl: './account-settings.page.html',
  styleUrl: './account-settings.page.scss',
})
export class AccountSettingsPage {}
