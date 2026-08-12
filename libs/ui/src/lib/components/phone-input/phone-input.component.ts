import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  Input,
  NgZone,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import intlTelInput from 'intl-tel-input/intlTelInputWithUtils';
import type { Iso2 } from 'intl-tel-input';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor-directive';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';

@Component({
  selector: 'lib-phone-input',
  imports: [ValidationErrorsComponent],
  templateUrl: './phone-input.component.html',
  styleUrl: './phone-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
})
export class PhoneInputComponent
  extends ControlValueAccessorDirective<string>
  implements AfterViewInit
{
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  @Input() label = '';
  @Input() id: string = crypto.randomUUID();
  @Input() initialCountry: Iso2 = 'eg';

  private readonly inputEl =
    viewChild.required<ElementRef<HTMLInputElement>>('phoneEl');

  private iti?: ReturnType<typeof intlTelInput>;

  ngAfterViewInit(): void {
    const el = this.inputEl().nativeElement;

    this.zone.runOutsideAngular(() => {
      this.iti = intlTelInput(el, {
        initialCountry: this.initialCountry,
        separateDialCode: true,
        strictMode: true,
        formatAsYouType: true,
        countryOrder: ['eg', 'sa', 'ae'],
      });
    });

    const sync = () => this.zone.run(() => this.pushValue());
    el.addEventListener('input', sync);
    el.addEventListener('countrychange', sync);
    el.addEventListener('blur', () => this.zone.run(() => this.emitTouched()));

    this.writeValue(this.value());

    this.destroyRef.onDestroy(() => {
      el.removeEventListener('input', sync);
      el.removeEventListener('countrychange', sync);
      this.iti?.destroy();
    });
  }

  override writeValue(value: string | null): void {
    super.writeValue(value);
    if (this.iti) {
      this.iti.setNumber(value ?? '');
    }
  }

  private pushValue(): void {
    if (!this.iti) return;
    const raw = this.inputEl().nativeElement.value.trim();
    this.emitChange(raw ? this.iti.getNumber() : '');
  }

  get hasError(): boolean {
    if (!this.control) return false;
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }
}
