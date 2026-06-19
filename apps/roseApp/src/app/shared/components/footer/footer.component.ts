import { Component } from '@angular/core';
import { LanguageSwitcherComponent } from '@rose/i18n';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LanguageSwitcherComponent, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}