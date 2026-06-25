import { Component, forwardRef, input, Input } from '@angular/core';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor-directive';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { InputOtpModule } from 'primeng/inputotp'; 

@Component({
  selector: 'lib-otp-input',
  imports: [CommonModule, InputOtpModule, FormsModule],
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.scss',
  providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OtpInputComponent),
    multi: true,
  },
],
})
export class OtpInputComponent  extends ControlValueAccessorDirective<string> {
  length = input<number>(6);
  otpServerError = input<boolean>(false);

 onValueChange(newValue: string) {

    this.value.set(newValue || '');
    this.emitChange(newValue || ''); 
  }
  onBlur() {
    this.emitTouched(); 
  }

 
}