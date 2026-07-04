import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../../../core/models/product.model';
import { ProductsService } from '../../services/product-list/products.service';
import { ProductsGridComponent } from '../../components/product-list/products-grid/products-grid.component';
import { ProductsPaginationComponent } from '../../components/product-list/products-pagination/products-pagination.component';
import { ProductsFilterComponent } from '../../components/product-list/products-filter/products-filter.component';

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
export class ProductsPage implements OnInit, OnDestroy {
  private productsService = inject(ProductsService);
  private sub?: Subscription;

  private readonly limit = 20;

  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  page = signal<number>(1);
  totalPages = signal<number>(1);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.sub?.unsubscribe();
    this.sub = this.productsService.getProducts(this.page(), this.limit).subscribe({
      next: (payload) => {
        this.products.set(payload.data);
        this.page.set(payload.metadata.page);
        this.totalPages.set(payload.metadata.totalPages);
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
    // TODO: navigate to product detail once the detail route is enabled.
    console.log('details', id);
  }

  onWishlist(id: string): void {
    // TODO: wire wishlist feature.
    console.log('wishlist', id);
  }

  onQuickView(id: string): void {
    // TODO: wire quick view.
    console.log('quickView', id);
  }

  onAddToCart(id: string): void {
    // TODO: wire add-to-cart feature.
    console.log('addToCart', id);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
