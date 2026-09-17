import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL_CONFIG } from '@org/auth';
import {  Observable } from 'rxjs';
import { UploadResponse } from '../models/upload-response.model';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrlConfig = inject(BASE_URL_CONFIG);

  // Uploads an image and returns its URL.
  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();

    formData.append('image', file);

    return this._httpClient.post<UploadResponse>(
      `${this._baseUrlConfig.apiUrl}/upload`,
      formData
    );
  }
}