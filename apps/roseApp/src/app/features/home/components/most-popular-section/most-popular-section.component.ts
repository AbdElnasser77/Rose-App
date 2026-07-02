import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, timeout } from 'rxjs';
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
  imports: [ProductCardComponent, TranslatePipe,SectionTitleComponent],
  templateUrl: './most-popular-section.component.html',
  styleUrl: './most-popular-section.component.scss',
})
export class MostPopularSectionComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);

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

    return matchedProducts.length ? matchedProducts : allProducts;
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
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
         const products = response?.payload?.data ?? [];
const productsWithValidImages = this.prepareProductsImages(products as Product[]);
this.products.set(this.sortMostPopular(productsWithValidImages));
        },
        error: (error) => {
          console.error('Most Popular API Error:', error);
          this.errorMessage.set('MOST_POPULAR.ERROR');
        },
      });
  }

  viewMore(): void {
    this.displayedLimit.update((value) => value + 4);
  }

goToProductDetails(productId: string): void {
  this.router.navigate(['/products', productId]);
}

onCartClick(productId: string): void {
  console.log('Add to cart UI only:', productId);
}

onWishlistClick(productId: string): void {
  console.log('Wishlist UI only:', productId);
}



private prepareProductsImages(products: Product[]): Product[] {
  return products
    .map((product) => {
      const image = this.getValidProductImage(product);

      return {
        ...product,
        cover: image,
      };
    })
    .filter((product) => !!product.cover);
}

private getValidProductImage(product: Product): string {
  if (this.isValidApiImage(product.cover)) {
    return product.cover;
  }

  const galleryImages = this.getGalleryImages(product.gallery);
  const validGalleryImage = galleryImages.find((image) =>
    this.isValidApiImage(image)
  );

  return validGalleryImage || '';
}





private getGalleryImages(gallery: string): string[] {
  try {
    const parsedGallery = JSON.parse(gallery || '[]');
    return Array.isArray(parsedGallery) ? parsedGallery : [];
  } catch {
    return [];
  }
}

private isValidApiImage(url?: string): boolean {
  if (!url) {
    return false;
  }

  const cleanUrl = url.trim();

  return (
    cleanUrl.includes('/storage/entities/product/') &&
    /\.(png|jpg|jpeg|webp|gif)$/i.test(cleanUrl)
  );
}








  private sortMostPopular(products: Product[]): Product[] {
    return [...products].sort((firstProduct, secondProduct) => {
      const ratingDiff = secondProduct.rating - firstProduct.rating;

      if (ratingDiff !== 0) {
        return ratingDiff;
      }

      const firstPopularity =
        firstProduct._count.cartItems + firstProduct._count.wishlistItems;

      const secondPopularity =
        secondProduct._count.cartItems + secondProduct._count.wishlistItems;

      return secondPopularity - firstPopularity;
    });
  }
}