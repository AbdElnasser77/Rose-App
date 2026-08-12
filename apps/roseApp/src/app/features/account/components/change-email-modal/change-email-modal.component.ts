import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonComponent, ReusableInputComponent } from '@org/ui';
import { LoaderService } from '@org/shared-util-loader';
import { ToastService } from '@org/shared-util-notification';
import { AuthFacade, AuthStore } from '@org/auth';
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-change-email-modal',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    ButtonComponent,
    ReusableInputComponent,
    DialogModule,
    InputOtpModule,
    LucideAngularModule,
  ],
  templateUrl: './change-email-modal.component.html',
  styleUrl: './change-email-modal.component.scss',
})
export class ChangeEmailModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authFacade = inject(AuthFacade);
  private readonly authStore = inject(AuthStore);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  readonly visible = input<boolean>(false);

  readonly changed = output<void>();
  readonly closed = output<void>();

  readonly ArrowLeft = ArrowLeft;

  readonly step = signal<'email' | 'code'>('email');
  /** The address the code was sent to, echoed back on the code step. */
  readonly pendingEmail = signal('');

  readonly emailForm = this.fb.nonNullable.group({
    newEmail: [
      '',
      [
        Validators.required,
        Validators.email,
        // Wrapped rather than passed directly so `this` resolves at call time -
        // the control runs its validators the moment it is constructed.
        (control: AbstractControl) => this.notCurrentEmail(control),
      ],
    ],
  });

  readonly codeForm = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    // Reopening must not resume a half-finished attempt from last time.
    effect(() => {
      if (!this.visible()) return;
      this.step.set('email');
      this.pendingEmail.set('');
      this.emailForm.reset();
      this.codeForm.reset();
    });
  }

  // Submitting the address you already have comes back from the server as
  // "email already in use", which reads like the address belongs to someone
  // else. Catch it here instead of spending a round trip on it.
  private notCurrentEmail(control: AbstractControl): ValidationErrors | null {
    const current = this.authStore.user()?.email?.trim().toLowerCase();
    const value = String(control.value ?? '')
      .trim()
      .toLowerCase();
    if (!current || !value) return null;
    return value === current ? { sameEmail: true } : null;
  }

  onVisibleChange(open: boolean): void {
    if (!open) {
      this.closed.emit();
    }
  }

  sendCode(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    const newEmail = this.emailForm.getRawValue().newEmail.trim();
    this.authFacade
      .requestEmailChange({ newEmail })
      .pipe(this.loader.track(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.pendingEmail.set(newEmail);
        this.step.set('code');
        this.toast.show(
          this.translate.instant('ACCOUNT.CHANGE_EMAIL.CODE_SENT'),
          'success'
        );
      });
  }

  goBack(): void {
    this.step.set('email');
    this.codeForm.reset();
  }

  confirm(): void {
    if (this.codeForm.invalid) {
      this.codeForm.markAllAsTouched();
      return;
    }
    const code = this.codeForm.getRawValue().code;
    this.authFacade
      .confirmEmailChange({ code })
      .pipe(this.loader.track(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toast.show(
          this.translate.instant('ACCOUNT.CHANGE_EMAIL.SUCCESS'),
          'success'
        );
        this.changed.emit();
      });
  }
}
