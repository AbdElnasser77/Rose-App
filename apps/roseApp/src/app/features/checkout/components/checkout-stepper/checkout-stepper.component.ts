import { Component, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';

@Component({
  selector: 'app-checkout-stepper',
  imports: [StepsModule],
  templateUrl: './checkout-stepper.component.html',
  styleUrl: './checkout-stepper.component.scss',
})
export class CheckoutStepperComponent {
  activeIndex = input.required<number>();
  
 
  readonly items: MenuItem[] = [
    {
      label: 'Shipping Address',
    },
    {
      label: 'Payment',
    },
  ];
}
