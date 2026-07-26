import {
  Component,
  DestroyRef,
  NgZone,
  effect,
  inject,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonComponent, ReusableInputComponent } from '@org/ui';
import { LoaderService } from '@org/shared-util-loader';
import { ToastService } from '@org/shared-util-notification';
import {
  LucideAngularModule,
  X,
  ArrowLeft,
  MapPinHouse,
} from 'lucide-angular';
import * as L from 'leaflet';
import { AddressesApiService } from '../../services/addresses-api.service';
import { CreateAddressDto } from '../../models/address.model';

const DEFAULT_CENTER: [number, number] = [30.0444, 31.2357];

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly addressesApi = inject(AddressesApiService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly zone = inject(NgZone);

  readonly cancelled = output<void>();
  readonly saved = output<void>();

  readonly X = X;
  readonly ArrowLeft = ArrowLeft;
  readonly MapPinHouse = MapPinHouse;

  readonly activeStep = signal(1);
  readonly latitude = signal<number>(DEFAULT_CENTER[0]);
  readonly longitude = signal<number>(DEFAULT_CENTER[1]);

  private map?: L.Map;
  private marker?: L.Marker;
  private resizeObserver?: ResizeObserver;

  readonly detailsForm = this.fb.nonNullable.group({
    city: ['', Validators.required],
    street: ['', Validators.required],
    phone: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      if (this.activeStep() === 2) {
        this.ensureMap();
      }
    });
    this.destroyRef.onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.map?.remove();
    });
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

  findMyLocation(): void {
    if (!navigator.geolocation) {
      this.notifyLocationError();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        this.zone.run(() =>
          this.setLocation(pos.coords.latitude, pos.coords.longitude, 15)
        ),
      () => this.zone.run(() => this.notifyLocationError())
    );
  }

  private notifyLocationError(): void {
    this.toast.show(
      this.translate.instant('CHECKOUT.ADD_ADDRESS.LOCATION_ERROR'),
      'default'
    );
  }

  submit(): void {
    if (this.detailsForm.invalid) {
      this.detailsForm.markAllAsTouched();
      return;
    }
    const value = this.detailsForm.getRawValue();
    const dto: CreateAddressDto = {
      title: value.city,
      city: value.city,
      street: value.street,
      phone: value.phone,
      isPrimary: false,
      latitude: this.latitude(),
      longitude: this.longitude(),
    };
    this.addressesApi
      .createAddress(dto)
      .pipe(this.loader.track(), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.show(
            this.translate.instant('CHECKOUT.ADD_ADDRESS.SUCCESS'),
            'success'
          );
          this.saved.emit();
        },
      });
  }

  close(): void {
    this.cancelled.emit();
  }

  private ensureMap(attempt = 0): void {
    const el = document.getElementById('address-map');
    if (!el || el.clientHeight === 0) {
      if (attempt < 20) {
        setTimeout(() => this.ensureMap(attempt + 1), 100);
      }
      return;
    }
    if (this.map && !document.body.contains(this.map.getContainer())) {
      this.map.remove();
      this.map = undefined;
      this.resizeObserver?.disconnect();
      this.resizeObserver = undefined;
    }
    if (!this.map) {
      this.initMap(el);
      this.resizeObserver = new ResizeObserver(() =>
        this.zone.runOutsideAngular(() => this.map?.invalidateSize())
      );
      this.resizeObserver.observe(el);
    }
    this.zone.runOutsideAngular(() => {
      this.map?.invalidateSize();
      setTimeout(() => this.map?.invalidateSize(), 250);
    });
  }

  private initMap(el: HTMLElement): void {
    this.zone.runOutsideAngular(() => {
      this.map = L.map(el, {
        center: [this.latitude(), this.longitude()],
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(this.map);

      const icon = L.divIcon({
        className: '',
        html: '<svg width="30" height="40" viewBox="0 0 24 24" fill="#DC2626" stroke="#ffffff" stroke-width="1.5"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5" fill="#ffffff" stroke="none"/></svg>',
        iconSize: [30, 40],
        iconAnchor: [15, 40],
      });

      this.marker = L.marker([this.latitude(), this.longitude()], {
        draggable: true,
        icon,
      }).addTo(this.map);

      this.marker.on('dragend', () => {
        const point = this.marker?.getLatLng();
        if (point) {
          this.latitude.set(point.lat);
          this.longitude.set(point.lng);
        }
      });

      this.map.on('click', (event: L.LeafletMouseEvent) => {
        this.setLocation(event.latlng.lat, event.latlng.lng);
      });
    });
  }

  private setLocation(lat: number, lng: number, zoom?: number): void {
    this.latitude.set(lat);
    this.longitude.set(lng);
    this.marker?.setLatLng([lat, lng]);
    if (zoom) {
      this.map?.setView([lat, lng], zoom);
    } else {
      this.map?.panTo([lat, lng]);
    }
  }
}
