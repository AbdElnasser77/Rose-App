import { Component } from '@angular/core';
import {WelcomeMessageComponent,DividerComponent,ReusableInputComponent,ButtonComponent,CalloutTextComponent} from '@org/ui';

@Component({
  selector: 'app-confirm-email-verification',
  imports: [WelcomeMessageComponent,DividerComponent,ReusableInputComponent,ButtonComponent,CalloutTextComponent],
  templateUrl: './confirm-email-verification.component.html',
  styleUrl: './confirm-email-verification.component.scss',
})
export class ConfirmEmailVerificationComponent {
    isLoading:boolean=false;

  submitConfirmEmailVerfication(){

  }
}
