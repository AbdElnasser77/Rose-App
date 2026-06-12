import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive/control-value-accessor-directive';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChevronDown ,LucideAngularModule} from 'lucide-angular';

@Component({
  selector: 'lib-select-input',
  imports: [ValidationErrorsComponent,LucideAngularModule],
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
export class SelectInputComponent<T>
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
