import { Directive, forwardRef, inject, Injector, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ValidationErrors } from '@angular/forms';
@Directive({
  selector: '[libControlValueAccessorDirective]',
})
export class ControlValueAccessorDirective <T> implements ControlValueAccessor {
   private injector = inject(Injector);

   value = signal<T | null>(null);
   isDisabled = signal(false);

   private onChange = (value: T | null) => {};
   private onTouched = () => {};
  
  
 writeValue(value: T | null): void {
  this.value.set(value);
  }
  registerOnChange(fn: (value: T | null) => void): void {
  this.onChange = fn;
  }
 registerOnTouched(fn: () => void): void {
  this.onTouched = fn;
  }
 
  
  setDisabledState(isDisabled: boolean): void {
  this.isDisabled.set(isDisabled);
  }
  protected emitChange(value: T | null) {
    this.value.set(value);
    this.onChange(value);
  }

  protected emitTouched() {
    this.onTouched();
  }

  
 
  get control() {
  return this.injector.get(NgControl, null)?.control ?? null;
}
get errors(): ValidationErrors | null {
  return this.control?.errors ?? null;
}
}

