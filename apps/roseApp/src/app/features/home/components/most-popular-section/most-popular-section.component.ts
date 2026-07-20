import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductsService } from '../../../../core/services/products.service';
import type { Product } from '../../../../shared/models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { ToastService } from '@org/shared-util-notification';
import { CartService } from '../../../cart/services/cart.service';

const TABS = [
  { value: 'Wedding', labelKey: 'MOST_POPULAR.TABS.WEDDING' },
  { value: 'Anniversary', labelKey: 'MOST_POPULAR.TABS.ANNIVERSARY' },
  { value: 'Birthday', labelKey: 'MOST_POPULAR.TABS.BIRTHDAY' },
  { value: 'Engagement', labelKey: 'MOST_POPULAR.TABS.ENGAGEMENT' },
] as const;

type Tab = (typeof TABS)[number]['value'];

@Component({
  selector: 'app-most-popular-section',
  standalone: true,
  imports: [ProductCardComponent, TranslatePipe, SectionTitleComponent],
  templateUrl: './most-popular-section.component.html',
  styleUrl: './most-popular-section.component.scss',
})
export class MostPopularSectionComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
    private cartService = inject(CartService);

  readonly tabs = TABS;
  readonly activeTab = signal<Tab>('Anniversary');

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(false);
  readonly displayedLimit = signal(12);
  readonly wishlistedIds = signal<Set<string>>(new Set());

  readonly filteredProducts = computed(() => {
    const tab = this.activeTab().toLowerCase();
    const allProducts = this.products();

    const matchedProducts = allProducts.filter((product) =>
      product.occasions?.some((occasion: any) =>
        occasion?.title?.toLowerCase().includes(tab)
      )
    );

    return matchedProducts.length >= 4 ? matchedProducts : allProducts;
  });

  readonly displayedProducts = computed(() =>
    this.filteredProducts().slice(0, this.displayedLimit())
  );

  ngOnInit(): void {
    this.getMostPopularProducts();
  }

  selectTab(tab: Tab): void {
    this.activeTab.set(tab);
    this.displayedLimit.set(12);
  }

  getMostPopularProducts(): void {
    this.isLoading.set(true);

    this.productsService
      .getProducts({ page: 1, limit: 20 })
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          const products = response?.payload?.data ?? [];
          this.products.set(this.sortMostPopular(products as Product[]));
        },
      });
  }

  viewMore(): void {
    this.displayedLimit.update((value) => value + 4);
  }

  goToProductDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  addToCartClicked(productId: string): void {
     this.cartService.addToCart({ productId: productId, quantity: 1 }).pipe(
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

  onWishlistClick(productId: string): void {
    const current = new Set(this.wishlistedIds());
    if (current.has(productId)) {
      current.delete(productId);
      this.toastService.show('Product removed from wishlist', 'default');
    } else {
      current.add(productId);
      this.toastService.show('Product added to wishlist', 'success');
    }
    this.wishlistedIds.set(current);
  }

  private sortMostPopular(products: Product[]): Product[] {
    return [...products].sort((firstProduct, secondProduct) => {
      const ratingDiff =
        (secondProduct.rating ?? 0) - (firstProduct.rating ?? 0);

      if (ratingDiff !== 0) {
        return ratingDiff;
      }

      const firstPopularity =
        (firstProduct._count?.cartItems ?? 0) +
        (firstProduct._count?.wishlistItems ?? 0);

      const secondPopularity =
        (secondProduct._count?.cartItems ?? 0) +
        (secondProduct._count?.wishlistItems ?? 0);

      return secondPopularity - firstPopularity;
    });
  }
}