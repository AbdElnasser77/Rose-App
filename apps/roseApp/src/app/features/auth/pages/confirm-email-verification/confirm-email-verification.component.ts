import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacade, AuthStore, RegisterStore } from '@org/auth';
import { ToastService } from '@org/shared-util-notification';
import {WelcomeMessageComponent,DividerComponent,ReusableInputComponent,ButtonComponent,CalloutTextComponent} from '@org/ui';

@Component({
  selector: 'app-confirm-email-verification',
  imports: [ReactiveFormsModule,WelcomeMessageComponent,DividerComponent,ReusableInputComponent,ButtonComponent,CalloutTextComponent],
  templateUrl: './confirm-email-verification.component.html',
  styleUrl: './confirm-email-verification.component.scss',
})
export class ConfirmEmailVerificationComponent {
    private _fb=inject(FormBuilder);
    private readonly  _router = inject(Router);
    private readonly _authFacade=inject(AuthFacade);
    private readonly _toastService=inject(ToastService);
    private readonly _authStore=inject(AuthStore);
    readonly loading = this._authStore.loading;
    private readonly _registerStore = inject(RegisterStore);
    email: string | null = null;
  
    confirmEmailVerificationForm:FormGroup=this._fb.group({
      d1: ['',[Validators.required, Validators.pattern(/^[0-9]$/)]],
      d2: ['',[Validators.required, Validators.pattern(/^[0-9]$/)]],
      d3: ['',[Validators.required, Validators.pattern(/^[0-9]$/)]],
      d4: ['',[Validators.required, Validators.pattern(/^[0-9]$/)]],
      d5: ['',[Validators.required, Validators.pattern(/^[0-9]$/)]],
      d6: ['',[Validators.required, Validators.pattern(/^[0-9]$/)]],
    });

  
  onConfirmEmailVerificationSubmit(){
    if(this.confirmEmailVerificationForm.invalid){
       this.confirmEmailVerificationForm.markAllAsTouched();
       return;
    }
    if (!this.email) {
      this._router.navigate(['/auth/send-email-verification']);
      return;
    }
    const form = this.confirmEmailVerificationForm.value;
    const otp=form.d1+form.d2+form.d3+form.d4+form.d5+form.d6;

    this._authFacade.confirmEmailVerification({
      email:this.email,
      code:otp
       }).subscribe({
      next :(res)=>{
        this._toastService.show(res.message, 'success');
        this._registerStore.setStep(3);
        this._router.navigate(['auth/register']);
      }
    })

  }

   ngOnInit() {
      this.confirmEmailVerificationForm.reset();
    this.email = this._registerStore.email() ?? null;

     const step = this._registerStore.step();

    if (!this.email || step < 2) {
      this._router.navigate(['/auth/send-email-verification']);
    }
  }

}
