import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'lib-validation-errors',
  imports: [],
  templateUrl: './validation-errors.component.html',
  styleUrl: './validation-errors.component.scss',
})
export class ValidationErrorsComponent {
    @Input({required:true}) control: AbstractControl | null = null;

  get errorMessage(): string | null {
  const control = this.control;

  if (!control) return null;

  if (!control.touched && !control.dirty) return null;

  const errors = control.errors;
  if (!errors) return null;

  if (errors['required']) return 'This field is required';
  if (errors['email']) return 'Invalid email format';
  if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}`;
  if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength}`;

  return 'Invalid field';
}
}
