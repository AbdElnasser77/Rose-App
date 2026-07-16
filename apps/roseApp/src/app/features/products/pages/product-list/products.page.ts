import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../../../shared/models/product.model';
import { ProductsService } from '../../../../core/services/products.service';
import { ProductsGridComponent } from '../../components/product-list/products-grid/products-grid.component';
import { ProductsPaginationComponent } from '../../components/product-list/products-pagination/products-pagination.component';
import { ProductsFilterComponent } from '../../components/product-list/products-filter/products-filter.component';
import { Router } from '@angular/router';
import { ToastService } from '@org/shared-util-notification';
import { ProductFilterService } from '../../services/product-list/product-filter.service';
import { LucideAngularModule ,SlidersHorizontal} from 'lucide-angular';


@Component({
  selector: 'app-products',
  imports: [
    ProductsGridComponent,
    ProductsPaginationComponent,
    ProductsFilterComponent,LucideAngularModule
  ],
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss',
})
export class ProductsPage implements OnInit, OnDestroy {
  private productsService = inject(ProductsService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  protected readonly _productFilterService = inject(ProductFilterService);
  private sub?: Subscription;

  private readonly limit = 20;
  readonly SlidersHorizontal=SlidersHorizontal;
  readonly isMobileFilterOpen = signal<boolean>(false);
  readonly isFilterDrawerOpen = signal(false);
  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  page = signal<number>(1);
  totalPages = signal<number>(1);
  wishlistedIds = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.sub?.unsubscribe();
    this.sub = this.productsService.getProducts({ page: this.page(), limit: this.limit }).subscribe({
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
    const current = new Set(this.wishlistedIds());
    if (current.has(id)) {
      current.delete(id);
      this.toastService.show('Product removed from wishlist', 'default');
    } else {
      current.add(id);
      this.toastService.show('Product added to wishlist', 'success');
    }
    this.wishlistedIds.set(current);
  }

  onQuickView(id: string): void {
    this.router.navigate(['/products', id]);
  }

  onAddToCart(id: string): void {
    // TODO: wire add-to-cart feature.
    console.log('addToCart', id);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
