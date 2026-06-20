import { Component, inject, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lib-validation-errors',
  imports: [],
  templateUrl: './validation-errors.component.html',
  styleUrl: './validation-errors.component.scss',
})
export class ValidationErrorsComponent {
  private readonly translate = inject(TranslateService);

  @Input({ required: true }) control: AbstractControl | null = null;

  get errorMessage(): string | null {
    const control = this.control;
    if (!control) return null;
    if (!control.touched && !control.dirty) return null;
    const errors = control.errors;
    if (!errors) return null;

    if (errors['required']) return this.translate.instant('VALIDATION.REQUIRED');
    if (errors['email']) return this.translate.instant('VALIDATION.EMAIL');
    if (errors['pattern']) return this.translate.instant('VALIDATION.PATTERN');
    if (errors['minlength']) return this.translate.instant('VALIDATION.MIN_LENGTH', { length: errors['minlength'].requiredLength });
    if (errors['maxlength']) return this.translate.instant('VALIDATION.MAX_LENGTH', { length: errors['maxlength'].requiredLength });

    return this.translate.instant('VALIDATION.INVALID');
  }
}
