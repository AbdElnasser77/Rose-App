import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  Subject,
  catchError,
  forkJoin,
  of,
  startWith,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ProductsService } from '../../../../core/services/products.service';
import type { Product } from '../../../../shared/models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { ToastService } from '@org/shared-util-notification';
import { WishlistStore } from '../../../wishlist/store/wishlist.store';
import { CartStore } from '../../../cart/store/cart.store';
import { OccasionsService } from '../../../products/services/product-list/occasions.service';
import type { Occasion } from '../../../products/models/occasion.model';
import { AssetUrlPipe } from '../../../../core/pipes/asset-url.pipe';

const TABS = [
  { value: 'Wedding', labelKey: 'MOST_POPULAR.TABS.WEDDING' },
  { value: 'Anniversary', labelKey: 'MOST_POPULAR.TABS.ANNIVERSARY' },
  { value: 'Birthday', labelKey: 'MOST_POPULAR.TABS.BIRTHDAY' },
  { value: 'Engagement', labelKey: 'MOST_POPULAR.TABS.ENGAGEMENT' },
] as const;

type Tab = (typeof TABS)[number]['value'];

const SKELETON_MIN_DURATION_MS = 400;

@Component({
  selector: 'app-most-popular-section',
  standalone: true,
  imports: [ProductCardComponent, TranslatePipe, SectionTitleComponent, RouterLink ,AssetUrlPipe],
  templateUrl: './most-popular-section.component.html',
  styleUrl: './most-popular-section.component.scss',
})
export class MostPopularSectionComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly occasionsService = inject(OccasionsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly _wishlistStore = inject(WishlistStore);
  private _translateService = inject(TranslateService);
  private readonly _cartStore = inject(CartStore);

  
  readonly tabs = TABS;
  readonly activeTab = signal<Tab>(TABS[0].value);

  private readonly tabChanges = new Subject<Tab>();
  private readonly occasions = signal<Occasion[]>([]);

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(true);
  readonly displayedLimit = signal(12);
  readonly wishlistedIds = this._wishlistStore.wishlistedIds;

  readonly displayedProducts = computed(() =>
    this.products().slice(0, this.displayedLimit())
  );

  ngOnInit(): void {
    this.occasionsService
      .getOccasions()
      .pipe(
        catchError(() => of([] as Occasion[])),
        tap((occasions) => this.occasions.set(occasions)),
        // Occasions carry the ids the products endpoint filters on, so the tabs
        // can only be resolved once they have loaded.
        switchMap(() => this.tabChanges.pipe(startWith(this.activeTab()))),
        tap(() => this.isLoading.set(true)),
        // switchMap so a quick series of tab clicks can't resolve out of order.
        switchMap((tab) =>
          forkJoin({
            response: this.getMostPopularProducts(tab),
            skeletonHold: timer(SKELETON_MIN_DURATION_MS),
          })
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ response }) => {
        const products = (response?.payload?.data ?? []) as Product[];

        this.products.set(this.sortMostPopular(this.matchingActiveTab(products)));
        this.isLoading.set(false);
      });
  }

  selectTab(tab: Tab): void {
    if (tab === this.activeTab()) {
      return;
    }

    this.activeTab.set(tab);
    this.displayedLimit.set(12);
    this.tabChanges.next(tab);
  }

  private getMostPopularProducts(tab: Tab) {
    return this.productsService
      .getProducts(
        {
          page: 1,
          limit: 20,
          occasionId: this.occasionIdFor(tab),
        },
        { skipLoader: true }
      )
      .pipe(catchError(() => of(null)));
  }

  private occasionIdFor(tab: Tab): string | undefined {
    const title = tab.toLowerCase();
    const occasions = this.occasions();

    return (
      occasions.find((occasion) => occasion.title?.toLowerCase().trim() === title)
        ?.id ??
      occasions.find((occasion) => occasion.title?.toLowerCase().includes(title))
        ?.id
    );
  }

  /**
   * Guards the tab both ways: the response is unfiltered when the tab maps to no
   * occasion id, and the title match is a no-op when the endpoint did filter --
   * so matching on the title is only skipped when the payload omits occasions.
   */
  private matchingActiveTab(products: Product[]): Product[] {
    const tab = this.activeTab();
    const title = tab.toLowerCase();

    const matched = products.filter((product) =>
      product.occasions?.some((occasion: any) =>
        occasion?.title?.toLowerCase().includes(title)
      )
    );

    if (this.occasionIdFor(tab)) {
      return matched.length ? matched : products;
    }

    return matched;
  }

  viewMore(): void {
    this.displayedLimit.update((value) => value + 4);
  }

  goToProductDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  addToCartClicked(productId: string): void {
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

  onWishlistClick(productId: string): void {
    const wasWishlisted = this._wishlistStore.isWishlisted(productId);

  this._wishlistStore.toggle(productId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
    next: () => {
      this.toastService.show(
        this._translateService.instant(
          wasWishlisted
            ? 'WISHLIST.ITEM_REMOVED'
            : 'WISHLIST.ITEM_ADDED'
        ),
         wasWishlisted ? 'default' : 'success'
      );
    }
  });
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