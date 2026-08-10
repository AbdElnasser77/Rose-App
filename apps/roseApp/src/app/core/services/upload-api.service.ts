import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BASE_URL_CONFIG } from '@org/auth';

interface UploadResponse {
  status: boolean;
  code: number;
  payload: {
    url: string;
  };
}

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

@Injectable({
  providedIn: 'root',
})
export class UploadApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrlConfig = inject(BASE_URL_CONFIG);

  uploadImage(file: File): Observable<string> {
    const body = new FormData();
    body.append('image', file);
    return this.http
      .post<UploadResponse>(`${this.baseUrlConfig.apiUrl}/upload`, body)
      .pipe(map((res) => res.payload.url));
  }

  toAbsoluteUrl(path: string | null | undefined): string {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    const origin = new URL(this.baseUrlConfig.apiUrl).origin;
    return `${origin}/${path.replace(/^\//, '')}`;
  }
}
