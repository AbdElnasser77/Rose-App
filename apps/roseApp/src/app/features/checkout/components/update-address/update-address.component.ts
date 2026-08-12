import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { StepperModule } from 'primeng/stepper';
import {
  ButtonComponent,
  PhoneInputComponent,
  ReusableInputComponent,
} from '@org/ui';
import { LoaderService } from '@org/shared-util-loader';
import { ToastService } from '@org/shared-util-notification';
import { LucideAngularModule, X, ArrowLeft } from 'lucide-angular';
import { AddressesApiService } from '../../services/addresses-api.service';
import { Address, UpdateAddressDto } from '../../models/address.model';
import { AddressLocationMapComponent } from '../address-location-map/address-location-map.component';

const DEFAULT_CENTER: [number, number] = [30.0444, 31.2357];

@Component({
  selector: 'app-update-address',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    StepperModule,
    ButtonComponent,
    ReusableInputComponent,
    PhoneInputComponent,
    LucideAngularModule,
    AddressLocationMapComponent,
  ],
  templateUrl: './update-address.component.html',
  styleUrl: './update-address.component.scss',
})
export class UpdateAddressComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly addressesApi = inject(AddressesApiService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  readonly address = input.required<Address>();

  readonly cancelled = output<void>();
  readonly saved = output<void>();

  readonly X = X;
  readonly ArrowLeft = ArrowLeft;

  readonly activeStep = signal(1);
  readonly latitude = signal<number>(DEFAULT_CENTER[0]);
  readonly longitude = signal<number>(DEFAULT_CENTER[1]);

  readonly detailsForm = this.fb.nonNullable.group({
    city: ['', Validators.required],
    street: ['', Validators.required],
    phone: ['', Validators.required],
  });

  ngOnInit(): void {
    const address = this.address();
    this.detailsForm.patchValue({
      city: address.city,
      street: address.street,
      phone: address.phone,
    });
    this.latitude.set(this.toCoordinate(address.latitude, DEFAULT_CENTER[0]));
    this.longitude.set(this.toCoordinate(address.longitude, DEFAULT_CENTER[1]));
  }

  goToStep2(): void {
    if (this.detailsForm.invalid) {
      this.detailsForm.markAllAsTouched();
      return;
    }
    this.activeStep.set(2);
  }

  goBack(): void {
    this.activeStep.set(1);
  }

  submit(): void {
    if (this.detailsForm.invalid) {
      this.detailsForm.markAllAsTouched();
      return;
    }
    const value = this.detailsForm.getRawValue();
    const dto: UpdateAddressDto = {
      title: value.city,
      city: value.city,
      street: value.street,
      phone: value.phone,
      isPrimary: this.address().isPrimary ?? false,
      latitude: this.latitude(),
      longitude: this.longitude(),
    };
    this.addressesApi
      .updateAddress(this.address().id, dto)
      .pipe(this.loader.track(), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.show(
            this.translate.instant('CHECKOUT.UPDATE_ADDRESS.SUCCESS'),
            'success'
          );
          this.saved.emit();
        },
      });
  }

  close(): void {
    this.cancelled.emit();
  }

  private toCoordinate(value: string | undefined, fallback: number): number {
    const parsed = Number(value);
    return value != null && value !== '' && !Number.isNaN(parsed)
      ? parsed
      : fallback;
  }
}
