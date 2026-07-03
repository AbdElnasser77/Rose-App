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

import { Product } from '../../models/product.model';
import { ProductDataService } from './../../services/product-data-api.service';

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
  ],
  templateUrl: './product-data.component.html',
  styleUrl: './product-data.component.scss',
})
export class ProductDataComponent implements OnInit {
  private readonly productDetailsService = inject(ProductDataService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  productId = signal('');
  productData = signal<any>('');
  product!: Product;
  images: string[] = [];
  selectedImage = signal<any>('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId.set(id || '');
    this.getProductDetails();
  }

  getProductDetails(): void {
    this.productDetailsService
      .getProductDetails(this.productId())
      .pipe(takeUntilDestroyed(this.destroyRef))
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
}