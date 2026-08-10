import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonComponent, ReusableInputComponent } from '@org/ui';
import { LoaderService } from '@org/shared-util-loader';
import { ToastService } from '@org/shared-util-notification';
import { AuthFacade } from '@org/auth';
import {
  passwordDifferentValidator,
  passwordMatchValidator,
} from '@org/util-validation';

@Component({
  selector: 'app-change-password',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    ButtonComponent,
    ReusableInputComponent,
  ],
  templateUrl: './change-password.page.html',
  styleUrl: './change-password.page.scss',
})
export class ChangePasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authFacade = inject(AuthFacade);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  readonly passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        passwordMatchValidator('newPassword', 'confirmPassword'),
        passwordDifferentValidator('currentPassword', 'newPassword'),
      ],
    }
  );

  get mismatch(): boolean {
    return (
      this.passwordForm.hasError('passwordMismatch') &&
      this.passwordForm.controls.confirmPassword.dirty
    );
  }

  get sameAsOld(): boolean {
    return (
      this.passwordForm.hasError('samePassword') &&
      this.passwordForm.controls.newPassword.dirty
    );
  }

  submit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.authFacade
      .changePassword(this.passwordForm.getRawValue())
      .pipe(this.loader.track(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.passwordForm.reset();
        this.toast.show(
          this.translate.instant('ACCOUNT.CHANGE_PASSWORD.SUCCESS'),
          'success'
        );
      });
  }
}
