import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent, ReusableInputComponent, DividerComponent } from '@org/ui';
import { AuthFacade, AuthStore } from '@org/auth';
import { ToastService } from '@org/shared-util-notification';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { passwordMatchValidator } from '@org/util-validation';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterModule, ReusableInputComponent, ButtonComponent, DividerComponent, TranslatePipe],
  templateUrl: './reset-password.page.html',
  styleUrl: './reset-password.page.scss',
})
export class ResetPasswordPage implements OnInit {
  private readonly authFacade = inject(AuthFacade);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly authStore = inject(AuthStore);

  private token = '';


  resetForm = inject(FormBuilder).nonNullable.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
        { validators: passwordMatchValidator('password','confirmPassword') }
    
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
        this.toastService.show(this.translate.instant('AUTH.PASSWORD_RESET_SUCCESS'), 'success');
        this.router.navigate(['/auth/login']);
      },
    });
  }

  
}
