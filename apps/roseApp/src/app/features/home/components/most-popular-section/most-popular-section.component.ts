import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductsService } from '../../../../core/services/products.service';
import type { Product } from '../../../../core/models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';

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

  readonly tabs = TABS;
  readonly activeTab = signal<Tab>('Anniversary');

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly displayedLimit = signal(12);

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
    this.errorMessage.set('');

    this.productsService
      .getProducts({ page: 1, limit: 20 })
      .pipe(
        timeout(10000),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          const products = response?.payload?.data ?? [];
          this.products.set(this.sortMostPopular(products as Product[]));
        },
        error: () => {
          this.errorMessage.set('MOST_POPULAR.ERROR');
        },
      });
  }

  viewMore(): void {
    this.displayedLimit.update((value) => value + 4);
  }

  goToProductDetails(productId: string): void {
    this.router.navigate(['/product-details', productId]);
  }

  onCartClick(productId: string): void {
    void productId;
  }

  onWishlistClick(productId: string): void {
    void productId;
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