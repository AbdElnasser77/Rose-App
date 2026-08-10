import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordDifferentValidator(
  currentPasswordKey: string,
  newPasswordKey: string
): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const currentPassword = form.get(currentPasswordKey)?.value;
    const newPassword = form.get(newPasswordKey)?.value;

    if (!currentPassword || !newPassword) return null;
    return currentPassword === newPassword ? { samePassword: true } : null;
  };
}
