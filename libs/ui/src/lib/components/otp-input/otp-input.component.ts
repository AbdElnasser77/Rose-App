import { Component, forwardRef, Input } from '@angular/core';
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
  @Input() length = 6;

 onValueChange(newValue: string) {
    this.value.set(newValue || '');
    this.emitChange(newValue || ''); 
  }
  onBlur() {
    this.emitTouched(); 
  }

  getStyleClass(): string {
    const control = this.control;
    const showError = control?.invalid && (control.touched || control.dirty);

    if (this.isDisabled()) {
      return 'custom-otp-disabled';
    }
    if (showError) {
      return 'custom-otp-error';
    }
    return 'custom-otp-normal';
  }

  
  override writeValue(value: string | null): void {
    this.value.set(value || '');
  }
}