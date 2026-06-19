import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacade } from '@org/auth';
import {WelcomeMessageComponent,DividerComponent,ReusableInputComponent,ButtonComponent,CalloutTextComponent} from '@org/ui';
@Component({
  selector: 'app-send-email-verification',
  imports: [ReactiveFormsModule,WelcomeMessageComponent,DividerComponent,ReusableInputComponent,ButtonComponent,CalloutTextComponent],
  templateUrl: './send-email-verification.component.html',
  styleUrl: './send-email-verification.component.scss',
})
export class SendEmailVerificationComponent {
     private _fb=inject(FormBuilder);
    private readonly  _router = inject(Router);
    private _authFacade=inject(AuthFacade);


  isLoading:boolean=false;
  sendEmailVerificationForm :FormGroup=this._fb.group({
    email:['',[Validators.required,Validators.email]]
  });
  onSendEmailVerificationSubmit(){
    if(this.sendEmailVerificationForm.invalid){
      this.sendEmailVerificationForm.markAllAsTouched();
      return;
    }
    this.isLoading=true;
    const emailValue=this.sendEmailVerificationForm.value.email;
    this._authFacade.sendEmailVerification(emailValue).subscribe({
      next :()=>{
        this.isLoading=false;
        this._router.navigate(['auth/confirm-email-verification']);
      }
    })
  }
}
