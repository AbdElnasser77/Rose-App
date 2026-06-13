import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor-directive';
import { ChevronDown, LucideAngularModule } from 'lucide-angular';
import { ValidationErrorsComponent } from "../validation-errors/validation-errors.component";

@Component({
  selector: 'lib-select-input',
  imports: [LucideAngularModule, ValidationErrorsComponent],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss',
   providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectInputComponent),
        multi: true,
      },
    ],
})
export class SelectInputComponent <T>
  extends ControlValueAccessorDirective<T>  {
    readonly ChevronDown=ChevronDown;
    @Input() options: { label: string; value: T }[] = [];
    @Input() placeholder = 'Select...';
    @Input({ required: true }) label!: string;
    

    onSelectChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  this.emitChange(value as T);
}
  }