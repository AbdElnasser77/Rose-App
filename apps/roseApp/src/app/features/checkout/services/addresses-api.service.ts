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
      .pipe(map((res) => res.payload.addresses ?? []));
  }

  getAddress(id: string): Observable<Address> {
    return this.http
      .get<AddressResponse>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.payload.address));
  }

  createAddress(dto: CreateAddressDto): Observable<Address> {
    return this.http
      .post<AddressResponse>(this.baseUrl, dto)
      .pipe(map((res) => res.payload.address));
  }

  updateAddress(id: string, dto: UpdateAddressDto): Observable<Address> {
    return this.http
      .patch<AddressResponse>(`${this.baseUrl}/${id}`, dto)
      .pipe(map((res) => res.payload.address));
  }

  deleteAddress(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
