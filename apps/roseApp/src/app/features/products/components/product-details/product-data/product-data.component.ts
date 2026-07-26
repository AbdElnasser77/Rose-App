import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, tap } from 'rxjs';
import { ShoppingCart, LucideAngularModule, Heart, HeartPlus, HeartMinus } from 'lucide-angular';

import { Product } from '../../../../../shared/models/product.model';
import { ProductDataService } from '../../../services/product-details/product-data-api.service';
import { ButtonComponent } from '@org/ui';
import { ToastService } from '@org/shared-util-notification';
import { LoaderService } from '@org/shared-util-loader';
import { WishlistStore } from '../../../../wishlist/store/wishlist.store';
import { CartStore } from '../../../../cart/store/cart.store';

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
  private readonly loader = inject(LoaderService);
  private readonly _translateService = inject(TranslateService);
  private readonly _wishlistStore = inject(WishlistStore);
 
  readonly ShoppingCart = ShoppingCart;
  readonly HeartPlus = HeartPlus;
  readonly HeartMinus = HeartMinus;
  private readonly _cartStore = inject(CartStore);

  productId = signal('');
  productData = signal<any>('');
  product!: Product;
  images: string[] = [];
  selectedImage = signal<any>('');
  
  readonly isWishlisted = computed(() =>
  this._wishlistStore.isWishlisted(this.productId())
);

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
        switchMap((id) =>
          this.productDetailsService.getProductDetails(id).pipe(this.loader.track<any>())
        ),
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
    const wasWishlisted = this._wishlistStore.isWishlisted(this.productId());

    this._wishlistStore.toggle(this.productId()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next : () =>{
        this.toastService.show(
          this._translateService.instant(
            wasWishlisted ? 'WISHLIST.ITEM_REMOVED' : 'WISHLIST.ITEM_ADDED'
          ),
           wasWishlisted ? 'default' : 'success'
        );
      }
    });
  }

  addToCard() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id') || ''),
        filter((id) => !!id),
        tap((id) => this.productId.set(id)),
        switchMap((id) => this._cartStore.addToCart(id)),
        takeUntilDestroyed(this.destroyRef)
      )    
      .subscribe({
        next: (res: any) => {
          if (res.message == "Insufficient stock.") {
            this.toastService.show('out of the stock', 'success');
          } else {
            this.toastService.show('product added to cart', 'success');
          }
        },
      });
  }
}