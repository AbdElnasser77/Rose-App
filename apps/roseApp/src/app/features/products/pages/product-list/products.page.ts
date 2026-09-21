import { Component, DestroyRef, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { Product } from '../../../../shared/models/product.model';
import { ProductsService } from '../../../../core/services/products.service';
import { ProductsGridComponent } from '../../components/product-list/products-grid/products-grid.component';
import { ProductsFilterComponent } from '../../components/product-list/products-filter/products-filter.component';
import { Router } from '@angular/router';
import { ToastService } from '@org/shared-util-notification';
import { WishlistStore } from '../../../wishlist/store/wishlist.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { ProductFilterService } from '../../services/product-list/product-filter.service';
import { LucideAngularModule ,SlidersHorizontal} from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { CartStore } from '../../../cart/store/cart.store';
import { PaginationComponent } from '@org/ui';
import { ProductQueryParams } from '../../../../shared/models/products-list-response.model';


@Component({
  selector: 'app-products',
  imports: [
    ProductsGridComponent,
    PaginationComponent,
    ProductsFilterComponent,LucideAngularModule,TranslatePipe
  ],
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss',
})
export class ProductsPage implements OnInit {
  private productsService = inject(ProductsService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private readonly _wishlistStore = inject(WishlistStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly _translateService = inject(TranslateService);
  private readonly _cartStore = inject(CartStore);
  protected readonly _productFilterService = inject(ProductFilterService);

  private readonly limit = 20;
  readonly SlidersHorizontal=SlidersHorizontal;
  readonly isMobileFilterOpen = signal<boolean>(false);
  readonly isFilterDrawerOpen = signal(false);
  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  page = signal<number>(1);
  totalPages = signal<number>(1);
  wishlistedIds =  this._wishlistStore.wishlistedIds;
  private isFirstFilterEffect = true;
  
  ngOnInit(): void {
  this.loadProducts(false);
}

  readonly filterEffect =effect(() => {
    this._productFilterService.selectedCategoryIds();
    this._productFilterService.selectedOccasionIds();
    this._productFilterService.rating();
    this._productFilterService.priceFrom();
    this._productFilterService.priceTo();

      if (this.isFirstFilterEffect) {
        this.isFirstFilterEffect = false;
        return;
      }  

    this.page.set(1);
    untracked(() => {
    this.loadProducts(true);
  });
  });
  

  // Build the request params for fetching products based on the current filter state.
  private getProductQueryParams(): ProductQueryParams {
  const filter = this._productFilterService;

  return {
    page: this.page(),
    limit: this.limit,

    categoryId: filter.selectedCategoryIds()[0],
    occasionId: filter.selectedOccasionIds()[0],

    minPrice: filter.priceFrom() ?? undefined,
    maxPrice: filter.priceTo() ?? undefined,

    minRating: filter.rating() || undefined,
  };
  }

  loadProducts(skipLoader = false): void {
    this.loading.set(true);
    
    this.productsService.getProducts(this.getProductQueryParams(),{skipLoader}) .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (res) => {
        this.products.set(res.payload.data);
        this.page.set(res.payload.metadata.page);
        this.totalPages.set(res.payload.metadata.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.loadProducts(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDetails(id: string): void {
    this.router.navigate(['/products', id]);
  }

  onWishlist(id: string): void {
    const wasWishlisted = this._wishlistStore.isWishlisted(id);

    this._wishlistStore.toggle(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

  onQuickView(id: string): void {
    this.router.navigate(['/products', id]);
  }

  
     onAddToCart(productId: string): void {
      if (this._cartStore.isProductInCart(productId)) {
      this.toastService.show(
      this._translateService.instant('CART.ALREADY_IN_CART'),
      'default'
      );
      return;
      }

     this._cartStore
     .addToCart(productId)
     .pipe(takeUntilDestroyed(this.destroyRef))
     .subscribe({
     next: () => {
        this.toastService.show(
          this._translateService.instant('CART.PRODUCT_ADDED'),
          'success'
        );
      },
      error: (error) => {
        if (error === 'Insufficient stock.') {
          this.toastService.show(
            this._translateService.instant('CART.OUT_OF_STOCK'),
            'error'
          );
        }
      },
  });
  }

  
}
