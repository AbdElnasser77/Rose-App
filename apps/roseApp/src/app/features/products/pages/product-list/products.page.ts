import { Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Product } from '../../../../shared/models/product.model';
import { ProductsService } from '../../../../core/services/products.service';
import { ProductsGridComponent } from '../../components/product-list/products-grid/products-grid.component';
import { ProductsPaginationComponent } from '../../components/product-list/products-pagination/products-pagination.component';
import { ProductsFilterComponent } from '../../components/product-list/products-filter/products-filter.component';
import { Router } from '@angular/router';
import { ToastService } from '@org/shared-util-notification';
import { WishlistStore } from '../../../wishlist/store/wishlist.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  imports: [
    ProductsGridComponent,
    ProductsPaginationComponent,
    ProductsFilterComponent,
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


  private readonly limit = 20;

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

  onAddToCart(id: string): void {
    // TODO: wire add-to-cart feature.
    console.log('addToCart', id);
  }

  
}
