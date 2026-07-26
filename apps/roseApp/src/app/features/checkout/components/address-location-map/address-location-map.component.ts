import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  inject,
  model,
  viewChild,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '@org/shared-util-notification';
import { LucideAngularModule, MapPinHouse } from 'lucide-angular';
import * as L from 'leaflet';

@Component({
  selector: 'app-address-location-map',
  imports: [TranslatePipe, LucideAngularModule],
  templateUrl: './address-location-map.component.html',
  styleUrl: './address-location-map.component.scss',
})
export class AddressLocationMapComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly zone = inject(NgZone);

  readonly latitude = model.required<number>();
  readonly longitude = model.required<number>();

  readonly MapPinHouse = MapPinHouse;

  private readonly mapEl = viewChild.required<ElementRef<HTMLElement>>('mapEl');

  private map?: L.Map;
  private marker?: L.Marker;
  private resizeObserver?: ResizeObserver;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.map?.remove();
    });
  }

  ngAfterViewInit(): void {
    // PrimeNG mounts a stepper panel with `display: none` on its <p-motion> host and
    // only clears it on the next animation frame, so right now this container is 0x0.
    // Leaflet reads the container size once at construction, and a map built (or
    // resized) at 0x0 paints as an empty box, so wait for a real box before creating
    // it instead of guessing with a timer.
    const el = this.mapEl().nativeElement;
    this.zone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() =>
        this.onContainerResized(el)
      );
      this.resizeObserver.observe(el);
    });
  }

  private onContainerResized(el: HTMLElement): void {
    if (el.clientWidth === 0 || el.clientHeight === 0) {
      return;
    }
    if (!this.map) {
      this.initMap(el);
      return;
    }
    this.map.invalidateSize();
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

  private initMap(el: HTMLElement): void {
    this.zone.runOutsideAngular(() => {
      this.map = L.map(el, {
        center: [this.latitude(), this.longitude()],
        zoom: 13,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
          this.zone.run(() => {
            this.latitude.set(point.lat);
            this.longitude.set(point.lng);
          });
        }
      });

      this.map.on('click', (event: L.LeafletMouseEvent) => {
        this.zone.run(() =>
          this.setLocation(event.latlng.lat, event.latlng.lng)
        );
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
