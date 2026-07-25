import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BASE_URL_CONFIG } from '@org/auth';
import {
  Address,
  AddressListResponse,
  AddressResponse,
  CreateAddressDto,
  UpdateAddressDto,
} from '../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrlConfig = inject(BASE_URL_CONFIG);

  private get baseUrl(): string {
    return `${this.baseUrlConfig.apiUrl}/addresses`;
  }

  getAddresses(): Observable<Address[]> {
    return this.http
      .get<AddressListResponse>(this.baseUrl)
      .pipe(map((res) => res.payload.data ?? res.payload.addresses ?? []));
  }

  getAddress(id: string): Observable<Address | undefined> {
    return this.http
      .get<AddressResponse>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.payload.address ?? res.payload.data));
  }

  createAddress(dto: CreateAddressDto): Observable<Address | undefined> {
    return this.http
      .post<AddressResponse>(this.baseUrl, dto)
      .pipe(map((res) => res.payload.address ?? res.payload.data));
  }

  updateAddress(id: string, dto: UpdateAddressDto): Observable<Address | undefined> {
    return this.http
      .patch<AddressResponse>(`${this.baseUrl}/${id}`, dto)
      .pipe(map((res) => res.payload.address ?? res.payload.data));
  }

  deleteAddress(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
