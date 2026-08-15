import { Component, computed, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule , Globe} from 'lucide-angular';
import { AuthStore, SessionService } from '@org/auth';


@Component({
  selector: 'lib-language-switcher',
  imports: [TranslatePipe , LucideAngularModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent {
  private languageService = inject(LanguageService);
  private readonly authStore = inject(AuthStore);
  private readonly sessionService = inject(SessionService);


  readonly Globe = Globe;
  readonly isLoggedIn = computed(
    () => this.authStore.isAuthenticated() || this.sessionService.isAuthenticated()
  );
  get label(): string {
    return this.languageService.getCurrentLanguage() === 'ar' ? 'English' : 'العربية';
  }

  toggle(): void {
    const current = this.languageService.getCurrentLanguage();
    this.languageService.setLanguage(current === 'ar' ? 'en' : 'ar');
  }
}
