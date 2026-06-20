import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent, ReusableInputComponent, DividerComponent } from '@org/ui';
import { AuthFacade, AuthStore } from '@org/auth';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterModule, ReusableInputComponent, ButtonComponent, DividerComponent, TranslatePipe],
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.scss',
})
export class ForgotPasswordPage {
  private readonly authFacade = inject(AuthFacade);
  readonly authStore = inject(AuthStore);

  readonly step = signal<1 | 2>(1);
  readonly email = signal('');

  emailForm = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  stepBack(): void {
    this.step.set(1);
  }
  onSendCode(): void {
    if (this.emailForm.invalid) return;
    const { email } = this.emailForm.getRawValue();
    const redirectUrl = `${window.location.origin}/auth/reset-password`;
    this.authFacade.forgotPassword({ email, redirectUrl }).subscribe({
      next: () => {
        this.email.set(email);
        this.step.set(2);
      },
    });
  }
}
