import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BASE_URL_CONFIG } from '@org/auth';
import { Testimonial, TestimonialResponse } from '../models/testimonial.model';

@Injectable({
  providedIn: 'root',
})
export class TestimonialsService {
  private http = inject(HttpClient);
  private baseUrlConfig = inject(BASE_URL_CONFIG);

  getTestimonials(): Observable<Testimonial[]> {
    return this.http
      .get<TestimonialResponse>(`${this.baseUrlConfig.apiUrl}/testimonials`)
      .pipe(map((res) => res.payload.data));
  }
}
