import { Component, forwardRef, Input, signal } from '@angular/core';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor-directive';
import { InputType } from '../../types/input.type';
import { Eye, EyeOff ,LucideAngularModule} from 'lucide-angular';
import { ValidationErrorsComponent } from "../validation-errors/validation-errors.component";
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-reusable-input',
  imports: [CommonModule, LucideAngularModule, ValidationErrorsComponent],
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
export class ReusableInputComponent <T> extends ControlValueAccessorDirective<T> {
 readonly Eye = Eye;
 readonly EyeOff = EyeOff;
  
  @Input({ required: true }) label!: string;
  @Input() placeholder = '';
  @Input({ required: true }) type!: InputType;

  @Input() id = crypto.randomUUID();
  @Input() required = false;
  @Input() readonly = false;
  @Input() maxlength?: number;

  showPassword = signal(false);
  
updateValue(event: Event) {
  const input = event.target as HTMLInputElement;
   this.emitChange(input.value as T);  
  }

markTouched() {
  this.emitTouched();
}
 get hasError(): boolean {
  if (!this.control) return false;

  return this.control.invalid &&
         (this.control.dirty || this.control.touched);
}
}
