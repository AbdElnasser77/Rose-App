import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor-directive';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-otp-input',
  imports: [CommonModule],
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
 otpBoxes: string[] = [];
  focusedIndex: number | null = null;

ngOnInit() {
  this.otpBoxes = Array(this.length).fill('');
}
onInput(event: Event, index: number) {
  const input = event.target as HTMLInputElement;

  let val = input.value.replace(/\D/g, '');
  if (!val) return;

  const digit = val[0] ?? '';

  this.otpBoxes[index] = digit;
  input.value = digit;

  const otp = this.otpBoxes.join('');
  this.emitChange(otp);

  const next = input.nextElementSibling as HTMLInputElement;
  next?.focus();
}

onKeyDown(event: KeyboardEvent, index: number) {
  const input = event.target as HTMLInputElement;

  if (event.key === 'Backspace' && !input.value) {
    this.otpBoxes[index] = '';
    input.value = '';

    this.emitChange(this.otpBoxes.join(''));

    const prev = input.previousElementSibling as HTMLInputElement;
    prev?.focus();
  }
}

get otpValue(): string {
  return this.otpBoxes.join('');
}

override writeValue(value: string | null): void {
  this.otpBoxes = Array(this.length).fill('');

  if (!value) return;

  value.split('').slice(0, this.length).forEach((c, i) => {
    this.otpBoxes[i] = c;
  });
}



onFocus(index: number) {
  this.focusedIndex = index;
}

onBlur() {
  this.focusedIndex = null;
  this.emitTouched();
}
getClass(index: number): string {
  const control = this.control;

  const showError =
    control?.invalid && (control.touched || control.dirty);

  const isFocused = this.focusedIndex === index;

  if (this.isDisabled()) {
    return 'bg-[#F4F4F5] border-[#A1A1AA] text-[#A1A1AA] cursor-not-allowed';
  }

  if (showError) {
    return 'border-[#DC2626] bg-white';
  }


  if (isFocused) {
    return 'border-[#A6252A] bg-white';
  }

  return 'border-[#D9D9D9] hover:border-[#A1A1AA] bg-white';
}
}