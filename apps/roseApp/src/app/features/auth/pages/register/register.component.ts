import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthFacade, AuthStore, RegisterStore } from '@org/auth';
import { ButtonComponent, DividerComponent, ReusableInputComponent, SelectInputComponent } from '@org/ui';
import { ToastService } from '@org/shared-util-notification';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule, ReusableInputComponent, ButtonComponent, DividerComponent, SelectInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private readonly authFacade = inject(AuthFacade);
  private readonly registerStore = inject(RegisterStore);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);

  currentStep = signal<1 | 2>(1);

  genderOptions = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
  ];

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const pwd = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pwd === confirm ? null : { passwordMismatch: true };
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
    { validators: this.passwordMatchValidator }
  );

  ngOnInit(): void {
    if (this.registerStore.step() >= 4) {
      this.currentStep.set(2);
    }
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
        this.toastService.show('Welcome to Rose! Your account has been created.', 'success');
        this.router.navigate(['/home']);
      },
    });
  }
}
