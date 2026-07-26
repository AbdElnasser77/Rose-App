import { Component } from '@angular/core';
import { CheckoutStepperComponent } from '../../components/checkout-stepper/checkout-stepper.component';

@Component({
  selector: 'app-payment',
  imports: [CheckoutStepperComponent],
  templateUrl: './payment.page.html',
  styleUrl: './payment.page.scss',
})
export class PaymentPage {}
