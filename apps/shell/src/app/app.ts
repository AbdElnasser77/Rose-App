import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '@rose/i18n';
import { ToastContainerComponent } from '@org/ui';
import { ToastService } from '@org/shared-util-notification';
@Component({
  imports: [RouterModule,ToastContainerComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',

})
export class App implements OnInit {
  private languageService = inject(LanguageService);
  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    this.languageService.initialize();
    this.loginSuccess()
  }

  loginSuccess() {
  this.toast.show('Login successful', 'success');
}
}
