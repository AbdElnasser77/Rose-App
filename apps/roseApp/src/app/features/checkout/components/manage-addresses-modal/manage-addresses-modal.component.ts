import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '@org/ui';
import { LoaderService } from '@org/shared-util-loader';
import { ToastService } from '@org/shared-util-notification';
import { LucideAngularModule, MapPin, Phone, Pencil, Trash2 } from 'lucide-angular';
import { Address } from '../../models/address.model';
import { AddressesApiService } from '../../services/addresses-api.service';
import { DialogModule } from 'primeng/dialog';
import { AddAddressComponent } from '../add-address/add-address.component';

@Component({
  selector: 'app-manage-addresses-modal',
  imports: [
    ButtonComponent,
    LucideAngularModule,
    TranslatePipe,
    DialogModule,
    AddAddressComponent,
  ],
  templateUrl: './manage-addresses-modal.component.html',
  styleUrl: './manage-addresses-modal.component.scss',
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class ManageAddressesModalComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly addressesApi = inject(AddressesApiService);
  private readonly loader = inject(LoaderService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  readonly closed = output<void>();

  readonly MapPin = MapPin;
  readonly Phone = Phone;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;

  readonly addresses = signal<Address[]>([]);
  readonly pendingDeleteId = signal<string | null>(null);
  readonly view = signal<'list' | 'add'>('list');

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.addressesApi
      .getAddresses()
      .pipe(this.loader.track(), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (addresses) => this.addresses.set(addresses),
        error: () => this.addresses.set([]),
      });
  }

  requestDelete(id: string): void {
    this.pendingDeleteId.set(id);
  }

  cancelDelete(): void {
    this.pendingDeleteId.set(null);
  }

  onDeleteDialogVisibleChange(open: boolean): void {
    if (!open) {
      this.pendingDeleteId.set(null);
    }
  }

  confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (!id) return;
    this.pendingDeleteId.set(null);
    this.addressesApi
      .deleteAddress(id)
      .pipe(this.loader.track(), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.show(
            this.translate.instant('CHECKOUT.MANAGE_ADDRESSES.DELETE_SUCCESS'),
            'success'
          );
          this.loadAddresses();
        },
      });
  }

  onAddressSaved(): void {
    this.view.set('list');
    this.loadAddresses();
  }

  onEscape(): void {
    if (this.pendingDeleteId() !== null) return;
    if (this.view() === 'add') {
      this.view.set('list');
      return;
    }
    this.close();
  }

  close(): void {
    this.closed.emit();
  }
}
