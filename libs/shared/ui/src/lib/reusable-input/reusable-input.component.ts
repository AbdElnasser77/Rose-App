import { Component, forwardRef,  Input, signal} from '@angular/core';
import {  ControlValueAccessor, NG_VALUE_ACCESSOR,  ValidationErrors } from '@angular/forms';
import { InputType } from '../../../../types/input.type';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'lib-reusable-input',
  imports: [CommonModule],
  templateUrl: './reusable-input.component.html',
  styleUrl: './reusable-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReusableInputComponent),
      multi: true,
    },
  ],
})
export class ReusableInputComponent <T =any > implements ControlValueAccessor {
  @Input({ required: true }) label!: string;
  @Input() placeholder: string='';
  @Input({ required: true }) type!:InputType;
  @Input() id = crypto.randomUUID();
  @Input() required = false;
  @Input() readonly = false;
  @Input() maxlength?: number;
  @Input() error: ValidationErrors | null = null;

  value=signal<T | null>(null);
  isDisabled=signal(false);
  showPassword = signal(false);


  onChange=(value :T)=>{};
  onTouched=()=>{};

  writeValue(value:T | null): void {
    this.value.set(value as T)
    
  }

  registerOnChange(fn: (value :T)=>void): void {
    this.onChange=fn;
  }

  registerOnTouched(fn: ()=>void): void {
    this.onTouched=fn;
  }
  private convertValue(value: string): any {
  if (this.type === 'number') {
    return value === '' ? null : Number(value);
  }
  return value;
}

  updateValue(event:Event){
    const input = event.target as HTMLInputElement;
    const value=this.convertValue(input.value);

    this.value.set(value);
    this.onChange(value);
  
  }

  markAsTouched() {
    this.onTouched();
  }
  setDisabledState(isDisabled: boolean): void {
      this.isDisabled.set(isDisabled);

  }

  togglePassword() {
  this.showPassword.update(v => !v);
}

get errorMessage(): string | null {
  if (!this.error) return null;

  if (this.error['required']) return 'This field is required';
  if (this.error['email']) return 'Invalid email format';

  if (this.error['minlength']) {
    return `Minimum length is ${this.error['minlength'].requiredLength}`;
  }

  if (this.error['maxlength']) {
    return `Maximum length is ${this.error['maxlength'].requiredLength}`;
  }

  return 'Invalid field';
}
}
