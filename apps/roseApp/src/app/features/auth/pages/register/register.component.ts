import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthFacade, AuthStore, RegisterStore } from '@org/auth';
import { ButtonComponent, DividerComponent, ReusableInputComponent, SelectInputComponent } from '@org/ui';
import { ToastService } from '@org/shared-util-notification';
import { passwordMatchValidator } from '@org/util-validation';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule, TranslatePipe, ReusableInputComponent, ButtonComponent, DividerComponent, SelectInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private readonly authFacade = inject(AuthFacade);
  private readonly registerStore = inject(RegisterStore);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);

  currentStep = signal<1 | 2>(1);
  genderOptions = signal<{ label: string; value: string }[]>([]);

  private buildGenderOptions(): void {
    this.genderOptions.set([
      { label: this.translate.instant('AUTH.MALE'), value: 'MALE' },
      { label: this.translate.instant('AUTH.FEMALE'), value: 'FEMALE' },
    ]);
  }

 

  registerForm = inject(FormBuilder).nonNullable.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator('password','confirmPassword') }
  );

  ngOnInit(): void {
    if (this.registerStore.step() >= 4) {
      this.currentStep.set(2);
    }
    this.buildGenderOptions();
    this.translate.onLangChange.subscribe(() => this.buildGenderOptions());
  }

  nextStep(): void {
    const formControls = ['firstName', 'lastName', 'username', 'gender'];
    formControls.forEach(key => this.registerForm.get(key)?.markAsTouched());
    const isValid = formControls.every(key => this.registerForm.get(key)?.valid);
    if (isValid) {
      this.registerStore.setStep(4);
      this.currentStep.set(2);
    }
  }

  backStep(): void {
    this.registerStore.setStep(3);
    this.currentStep.set(1);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const { firstName, lastName, username, gender, password, confirmPassword } = this.registerForm.getRawValue();
    const email = this.registerStore.email();
    this.authFacade.register({ firstName, lastName, username, email, gender: gender as any, password, confirmPassword }).subscribe({
      next: () => {
        this.registerStore.clear();
        this.toastService.show(this.translate.instant('AUTH.REGISTER_SUCCESS'), 'success');
        this.router.navigate(['/home']);
      },
    });
  }
}
