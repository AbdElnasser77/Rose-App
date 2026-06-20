import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent, ReusableInputComponent, DividerComponent } from '@org/ui';
import { AuthFacade, AuthStore } from '@org/auth';
import { ToastService } from '@org/shared-util-notification';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterModule, ReusableInputComponent, ButtonComponent, DividerComponent],
  templateUrl: './reset-password.page.html',
  styleUrl: './reset-password.page.scss',
})
export class ResetPasswordPage implements OnInit {
  private readonly authFacade = inject(AuthFacade);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly authStore = inject(AuthStore);

  private token = '';


  resetForm = inject(FormBuilder).nonNullable.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.router.navigate(['/auth/forgot-password']);
    }
  }

  onResetPassword(): void {
    if (this.resetForm.invalid) return;
    const { newPassword, confirmPassword } = this.resetForm.getRawValue();
    this.authFacade.resetPassword({ token: this.token, newPassword, confirmPassword }).subscribe({
      next: () => {
        this.toastService.show('Your password has been successfully reset.', 'success');
        this.router.navigate(['/auth/login']);
      },
    });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const pwd = control.get('newPassword')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pwd === confirm ? null : { passwordMismatch: true };
  }
}
