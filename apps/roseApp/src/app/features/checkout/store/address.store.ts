import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  concatMap,
  EMPTY,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@org/shared-util-notification';
import { AddressesApiService } from '../services/addresses-api.service';
import { Address } from '../models/address.model';

type AddressMutation =
  | { kind: 'setPrimary'; id: string }
  | { kind: 'delete'; id: string; wasPrimary: boolean };

@Injectable({
  providedIn: 'root',
})
export class AddressStore {
  private readonly _addressesApi = inject(AddressesApiService);
  private readonly _toast = inject(ToastService);
  private readonly _translate = inject(TranslateService);

  private readonly _mutations = new Subject<AddressMutation>();

  readonly addresses = signal<Address[]>([]);

  // Distinguishes "not fetched yet" from "this user has none" - callers that reconcile
  // a remembered selection against the list must not act on the empty initial value.
  readonly loaded = signal(false);

  readonly hasAddresses = computed(() => this.addresses().length > 0);

  /** Address shown as the delivery target: the primary one, else the first saved one. */
  readonly deliveryAddress = computed(
    () =>
      this.addresses().find((address) => address.isPrimary) ??
      this.addresses()[0] ??
      null
  );

  constructor() {
    // Every write goes through one queue. concatMap (not switchMap) because a delete
    // must never be cancelled by a later click, and because the optimistic state below
    // is only correct if the server applies the writes in the order the user made them.
    this._mutations
      .pipe(
        concatMap((mutation) => this.runMutation(mutation)),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  /** Never errors - a failed request leaves the store empty, same as having no addresses. */
  load(): Observable<Address[]> {
    return this._addressesApi.getAddresses().pipe(
      catchError(() => of<Address[]>([])),
      tap((addresses) => {
        this.addresses.set(addresses);
        this.loaded.set(true);
      })
    );
  }

  clear(): void {
    this.addresses.set([]);
    this.loaded.set(false);
  }

  setPrimary(id: string): void {
    const current = this.addresses();
    if (current.find((address) => address.id === id)?.isPrimary) {
      return;
    }
    // The API demotes the previous primary itself, so the end state is known up front -
    // apply it now and let the request catch up.
    this.addresses.set(
      current.map((address) => ({ ...address, isPrimary: address.id === id }))
    );
    this._mutations.next({ kind: 'setPrimary', id });
  }

  remove(id: string): void {
    const wasPrimary =
      this.addresses().find((address) => address.id === id)?.isPrimary ?? false;
    this.addresses.update((addresses) =>
      addresses.filter((address) => address.id !== id)
    );
    this._mutations.next({ kind: 'delete', id, wasPrimary });
  }

  private runMutation(mutation: AddressMutation): Observable<unknown> {
    if (mutation.kind === 'setPrimary') {
      return this._addressesApi
        .updateAddress(mutation.id, { isPrimary: true })
        .pipe(catchError(() => this.recover('SET_PRIMARY_ERROR')));
    }
    return this._addressesApi.deleteAddress(mutation.id).pipe(
      switchMap(() => {
        this._toast.show(this.message('DELETE_SUCCESS'), 'success');
        // Deleting the primary lets the server pick a new one, so resync to find out
        // which. Any other delete already matches what we applied locally.
        return mutation.wasPrimary ? this.load() : EMPTY;
      }),
      catchError(() => this.recover('DELETE_ERROR'))
    );
  }

  /** A failed write leaves the optimistic state wrong - take the server's word for it. */
  private recover(messageKey: string): Observable<Address[]> {
    this._toast.show(this.message(messageKey), 'error');
    return this.load();
  }

  private message(key: string): string {
    return this._translate.instant(`CHECKOUT.MANAGE_ADDRESSES.${key}`);
  }
}
