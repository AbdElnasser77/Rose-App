import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../../../../../libs/shared/i18n/src/lib/components/language-switcher.component';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {}
