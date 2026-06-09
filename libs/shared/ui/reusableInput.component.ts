
import { Component, forwardRef, Input, signal} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputType } from '../types/input.type';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'reusable-input',
  imports: [CommonModule],
  templateUrl: './reusableInput.component.html',
  styleUrl: './reusableInput.component.scss',
   providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReusableInputComponent),
      multi: true,
    },
  ],
})
export class ReusableInputComponent<T =any > implements ControlValueAccessor{
  @Input({ required: true }) label!: string;
  @Input({ }) placeholder: string='';
  @Input({ required: true }) type!:InputType;
  @Input() id = crypto.randomUUID();
  @Input() error: string | null = null;
  @Input() required = false;
  @Input() readonly = false;
  @Input() maxlength?: number;

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
}
