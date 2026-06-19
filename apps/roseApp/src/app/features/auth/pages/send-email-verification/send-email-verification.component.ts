import { Component } from '@angular/core';
import {WelcomeMessageComponent,DividerComponent,ReusableInputComponent,ButtonComponent,CalloutTextComponent} from '@org/ui';
@Component({
  selector: 'app-send-email-verification',
  imports: [WelcomeMessageComponent,DividerComponent,ReusableInputComponent,ButtonComponent,CalloutTextComponent],
  templateUrl: './send-email-verification.component.html',
  styleUrl: './send-email-verification.component.scss',
})
export class SendEmailVerificationComponent {
  isLoading:boolean=false;
  submitSendEmailVerfication(){

  }
}
