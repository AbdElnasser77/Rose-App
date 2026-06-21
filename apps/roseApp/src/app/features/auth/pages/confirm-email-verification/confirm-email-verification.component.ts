import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthFacade, AuthStore, RegisterStore } from '@org/auth';
import { ToastService } from '@org/shared-util-notification';
import {OtpInputComponent, WelcomeMessageComponent,DividerComponent,ButtonComponent,CalloutTextComponent} from '@org/ui';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CountdownComponent,CountdownEvent } from 'ngx-countdown';
import { ThemeService } from '@rose/theme';

@Component({
  selector: 'app-confirm-email-verification',
  imports: [ReactiveFormsModule, TranslatePipe,RouterModule, CountdownComponent, OtpInputComponent,WelcomeMessageComponent,DividerComponent,ButtonComponent,CalloutTextComponent],
  templateUrl: './confirm-email-verification.component.html',
  styleUrl: './confirm-email-verification.component.scss',
})
export class ConfirmEmailVerificationComponent {
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;

    private _fb=inject(FormBuilder);
    private readonly  _router = inject(Router);
    private readonly _authFacade=inject(AuthFacade);
    private readonly _toastService=inject(ToastService);
    private readonly _authStore=inject(AuthStore);
    readonly loading = this._authStore.loading;
    private readonly _registerStore = inject(RegisterStore);
    private readonly _translate = inject(TranslateService);
    readonly isDark = inject(ThemeService).isDark;
    email: string | null = null;
    confirmLoading = false;
    resendLoading = false;
    canResend = false;

    countdownConfig = {
     leftTime: 60,
     format: 'mm:ss'
     };
    handleCountdownEvent(event: CountdownEvent) {
    if (event.action === 'done') {
      this.canResend = true;
    }
    }


  
    confirmEmailVerificationForm:FormGroup=this._fb.group({
      otp: ['',[Validators.required,Validators.pattern(/^\d{6}$/)]],
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
      this.confirmLoading = true;
    const form = this.confirmEmailVerificationForm.value;

    this._authFacade.confirmEmailVerification({
      email:this.email,
      code:form.otp
       }).subscribe({
      next :()=>{
        this._toastService.show(this._translate.instant('AUTH.OTP_VERIFIED'), 'success');
        this._registerStore.setStep(3);
        this._router.navigate(['auth/register']);
          this.confirmLoading = false;

      },
    error: () => {
      this.confirmLoading = false;
    }
    })

  }
  onResendCode() {
  if (!this.email || !this.canResend) return;
    this.resendLoading = true;
  this._authFacade.sendEmailVerification({
    email: this.email,
  }).subscribe({
    next: () => {
      this._toastService.show(this._translate.instant('AUTH.CODE_RESENT'), 'success');
      this.confirmEmailVerificationForm.reset();
       this.resendLoading = false;
        this.canResend = false;
        this.countdownConfig = {
        leftTime: 60,
        format: 'mm:ss',
        
      };
    },
    error: () => {
      this.resendLoading = false;
    }
  });
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
