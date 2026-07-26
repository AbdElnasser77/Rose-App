import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-checkout-stepper',
  imports: [CommonModule],
  templateUrl: './checkout-stepper.component.html',
  styleUrl: './checkout-stepper.component.scss',
})
export class CheckoutStepperComponent {
    activeIndex = input.required<number>();

    readonly steps = [1, 2];
}
