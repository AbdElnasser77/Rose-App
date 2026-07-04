import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, tap } from 'rxjs';
import { ShoppingCart, LucideAngularModule, Heart, HeartPlus, HeartMinus } from 'lucide-angular';

import { Product } from '../../../../products/models/product.model';
import { ProductDataService } from '../../../services/product-details/product-data-api.service';
import { ButtonComponent } from '@org/ui';
import { ToastService } from '@org/shared-util-notification';

@Component({
  selector: 'app-product-data',
  imports: [
    RatingModule,
    DividerModule,
    TagModule,
    FormsModule,
    TranslatePipe,
    CommonModule,
    ButtonModule,
    ButtonComponent,
    LucideAngularModule,
  ],
  templateUrl: './product-data.component.html',
  styleUrl: './product-data.component.scss',
})
export class ProductDataComponent implements OnInit {
  private readonly productDetailsService = inject(ProductDataService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  readonly ShoppingCart = ShoppingCart;
  readonly HeartPlus = HeartPlus;
  readonly HeartMinus = HeartMinus;

  productId = signal('');
  productData = signal<any>('');
  product!: Product;
  images: string[] = [];
  selectedImage = signal<any>('');
  isWishlisted = signal(false);

  roundRating(value: number): number {
    if (!value) return 0;
    return Math.round(value * 2) / 2;
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id') || ''),
        filter((id) => !!id),
        tap((id) => this.productId.set(id)),
        switchMap((id) => this.productDetailsService.getProductDetails(id)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res) => {
          this.productData.set(res.payload.product);
          this.product = this.productData();

          const gallery = JSON.parse(this.product.gallery || '[]');

          this.images = [this.product.cover, ...gallery];
          this.selectedImage.set(this.images[0]);
        },
      });
  }

  onWishlistClicked(): void {
    const next = !this.isWishlisted();
    this.isWishlisted.set(next);
    if (next) {
      this.toastService.show('Product added to wishlist', 'success');
    } else {
      this.toastService.show('Product removed from wishlist', 'default');
    }
  }
}