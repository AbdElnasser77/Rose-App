import { Component, computed, inject, signal, OnInit, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Review } from '../../../../../core/models/product.model';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, tap } from 'rxjs';
import { ReviewsService } from '../../../services/product-details/reviews-api.service';
import { ButtonComponent } from '@org/ui';

@Component({
  selector: 'app-reviews',
  imports: [ 
    CommonModule,
    FormsModule,
    RatingModule,
    InputTextModule,
    Textarea,
    ButtonComponent, 
    TranslatePipe],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewersComponent implements OnInit {
  private readonly reviewsService = inject(ReviewsService);
  private readonly cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  reviewsData = signal<any[]>([]);
  averageRate = computed(() => {
    const reviews = this.reviewsData();
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const average = totalRating / reviews.length;
    return Math.round(average * 10) / 10;
  });

  rating = signal<number>(0);
  headline = signal('');
  content = signal('');
  productId = signal('');

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id') || ''),
        filter((id) => !!id),
        tap((id) => this.productId.set(id)),
        switchMap((id) => this.reviewsService.getReviews(id)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res) => {
          this.reviewsData.set(res.payload.data);
          this.cdr.detectChanges();
        },
      });
  }

  getReviews(): void {
    this.reviewsService.getReviews(this.productId()).subscribe({
      next: (res) => {
        this.reviewsData.set(res.payload.data);
        this.cdr.detectChanges();
      },
    });
  }
  addReview() {
    if (
      this.rating() === 0 ||
      !this.headline().trim() ||
      !this.content().trim()
    ) {
      return;
    }
    const newReview: Review = {
      rating: this.rating(),
      productId: this.productId(),
      headline: this.headline(),
      content: this.content()
    };
    this.reviewsService.postReviews(newReview).subscribe({
      next: () => {
        this.getReviews();
        this.clearForm();
      },
    });
  }

  clearForm() {
    this.rating.set(0);
    this.headline.set('');
    this.content.set('');
  }
}
