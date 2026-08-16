import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    
    this.productsService.getProducts({ page: this.page(), limit: this.limit }) .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (res) => {
        this._productFilterService.setProducts(res.payload.data);
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
    this.loadProducts();
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
     next: (res) => {
      if (res.message === 'Insufficient stock.') {
        this.toastService.show(
          this._translateService.instant('CART.OUT_OF_STOCK'),
          'error'
        );
      } else {
        this.toastService.show(
          this._translateService.instant('CART.PRODUCT_ADDED'),
          'success'
        );
      }
    },
  });
  }

  
}
