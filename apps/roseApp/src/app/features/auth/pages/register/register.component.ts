import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacade, AuthStore, RegisterStore } from '@org/auth';
import { ToastService } from '@org/shared-util-notification';
import { WelcomeMessageComponent, DividerComponent, ReusableInputComponent, ButtonComponent, CalloutTextComponent, SelectInputComponent } from '@org/ui';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, WelcomeMessageComponent, DividerComponent, ReusableInputComponent, ButtonComponent, CalloutTextComponent, SelectInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
        private _fb=inject(FormBuilder);
        private readonly  _router = inject(Router);
        private readonly _authFacade=inject(AuthFacade);
        private readonly _toastService=inject(ToastService);
        private readonly _authStore=inject(AuthStore);
        readonly loading = this._authStore.loading;
        private readonly _registerStore = inject(RegisterStore);
    
     gender=[
      {label:'MALE',value :'male'},
      {label :'FEMALE',value:'female'}
    ];
    email: string | null = null;

    
      
     registerForm: FormGroup = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      gender: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    onRegisterSubmit(){
       if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
    }
    if (!this.email) {
      this._router.navigate(['/auth/send-email-verification']);
      return;
    }

    const form = this.registerForm.value;

    this._authFacade.register({
      username: form.username,
      email:this.email ,
      password: form.password,
      confirmPassword: form.confirmPassword,
      firstName:form.firstName,
     lastName:form.lastName,
      gender:form.gender
       }).subscribe({
      next :()=>{
        this._toastService.show('Account created successfully', 'success');
        this._registerStore.clear();
        this._router.navigate(['auth/login']);
      }
    })

    }

    ngOnInit() {
    this.email = this._registerStore.email() ?? null;

    const step = this._registerStore.step();

    if (!this.email || step <3) {
      this._router.navigate(['/auth/send-email-verification']);
    }
  }

}
