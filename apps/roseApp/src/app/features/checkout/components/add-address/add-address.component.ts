import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonComponent, ReusableInputComponent } from '@org/ui';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-add-address',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    StepperModule,
    ButtonComponent,
    ReusableInputComponent,
    LucideAngularModule,
  ],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.scss',
})
export class AddAddressComponent {
  private readonly fb = inject(FormBuilder);

  readonly cancelled = output<void>();
  readonly saved = output<void>();

  readonly X = X;

  readonly activeStep = signal(1);

  readonly detailsForm = this.fb.nonNullable.group({
    city: ['', Validators.required],
    street: ['', Validators.required],
    phone: ['', Validators.required],
  });

  goToStep2(): void {
    if (this.detailsForm.invalid) {
      this.detailsForm.markAllAsTouched();
      return;
    }
    this.activeStep.set(2);
  }

  close(): void {
    this.cancelled.emit();
  }
}
