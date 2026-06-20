import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent, ReusableInputComponent, DividerComponent } from '@org/ui';
import { AuthFacade, AuthStore } from '@org/auth';
import { Check, LucideAngularModule } from "lucide-angular";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, ReusableInputComponent, ButtonComponent, DividerComponent, LucideAngularModule, TranslatePipe],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);
  readonly Check = Check;

  loginForm = inject(FormBuilder).nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    const { username, password, rememberMe } = this.loginForm.getRawValue();
    this.authFacade.login({ username, password }, rememberMe).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
    });
  }
}
