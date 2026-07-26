import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  output,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '@org/ui';
import { LoaderService } from '@org/shared-util-loader';
import { LucideAngularModule, MapPin, Phone, Pencil, Trash2 } from 'lucide-angular';
import { Address } from '../../models/address.model';
import { AddressStore } from '../../store/address.store';
import { DialogModule } from 'primeng/dialog';
import { AddAddressComponent } from '../add-address/add-address.component';
import { UpdateAddressComponent } from '../update-address/update-address.component';

@Component({
  selector: 'app-manage-addresses-modal',
  imports: [
    NgClass,
    ButtonComponent,
    LucideAngularModule,
    TranslatePipe,
    DialogModule,
    AddAddressComponent,
    UpdateAddressComponent,
  ],
  templateUrl: './manage-addresses-modal.component.html',
  styleUrl: './manage-addresses-modal.component.scss',
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class ManageAddressesModalComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly addressStore = inject(AddressStore);
  private readonly loader = inject(LoaderService);

  readonly closed = output<void>();

  readonly MapPin = MapPin;
  readonly Phone = Phone;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;

  readonly addresses = this.addressStore.addresses;
  readonly pendingDeleteId = signal<string | null>(null);
  readonly view = signal<'list' | 'add' | 'edit'>('list');
  readonly editingAddress = signal<Address | null>(null);

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.addressStore
      .load()
      .pipe(this.loader.track(), takeUntilDestroyed(this.destroyRef))
      .subscribe();
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
    this.addressStore.remove(id);
  }

  setPrimary(id: string): void {
    this.addressStore.setPrimary(id);
  }

  onAddressKeydown(event: KeyboardEvent, id: string): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.setPrimary(id);
  }

  startEdit(address: Address): void {
    this.editingAddress.set(address);
    this.view.set('edit');
  }

  showList(): void {
    this.editingAddress.set(null);
    this.view.set('list');
  }

  onAddressSaved(): void {
    this.showList();
    this.loadAddresses();
  }

  onEscape(): void {
    if (this.pendingDeleteId() !== null) return;
    if (this.view() !== 'list') {
      this.showList();
      return;
    }
    this.close();
  }

  close(): void {
    this.closed.emit();
  }
}
