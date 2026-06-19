import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacade, AuthStore, RegisterStore } from '@org/auth';
import {ToastService}  from '@org/shared-util-notification';
import {WelcomeMessageComponent,DividerComponent,ReusableInputComponent,ButtonComponent,CalloutTextComponent} from '@org/ui';
@Component({
  selector: 'app-send-email-verification',
  imports: [ReactiveFormsModule,WelcomeMessageComponent,DividerComponent,ReusableInputComponent,ButtonComponent,CalloutTextComponent],
  templateUrl: './send-email-verification.component.html',
  styleUrl: './send-email-verification.component.scss',
})
export class SendEmailVerificationComponent implements OnInit {
     private _fb=inject(FormBuilder);
    private readonly  _router = inject(Router);
    private readonly _authFacade=inject(AuthFacade);
    private readonly _toastService=inject(ToastService);
    private readonly _authStore=inject(AuthStore);
    readonly loading = this._authStore.loading;
    private readonly _registerStore = inject(RegisterStore);



  
  sendEmailVerificationForm :FormGroup=this._fb.group({
    email:['',[Validators.required,Validators.email,Validators.pattern(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      )]]
  });
  onSendEmailVerificationSubmit(){
   
    if(this.sendEmailVerificationForm.invalid){
      console.log('red');
      this.sendEmailVerificationForm.markAllAsTouched();
      return;
    }
    
    const emailValue=this.sendEmailVerificationForm.value.email;
    this._registerStore.setStep(1);
    this._registerStore.setEmail(emailValue);

    this._authFacade.sendEmailVerification({
       email:emailValue}).subscribe({
      next :(res)=>{
        this._toastService.show(res.message, 'success');
        this._registerStore.setStep(2);
        this._router.navigate(['auth/confirm-email-verification']);
      }
    })
  }

  ngOnInit() {
  const savedEmail = this._registerStore.email();

  if (savedEmail) {
    this.sendEmailVerificationForm.patchValue({
      email: savedEmail,
    });
  }
 }
}
