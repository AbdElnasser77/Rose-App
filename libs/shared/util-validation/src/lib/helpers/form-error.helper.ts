import { AbstractControl } from '@angular/forms';

export function hasDirtyError(
  form: AbstractControl,
  errorKey: string,
  controlName: string
): boolean {
  return form.hasError(errorKey) && !!form.get(controlName)?.dirty;
}
