import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {  ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { ProductDataService } from '../../../services/product-details/product-data-api.service';
import {
  RelatedProductsApiService,
  RelatedProductsParams,
} from '../../../services/product-details/related-products-api.service';
import { ToastService } from '@org/shared-util-notification';
import { LoaderService } from '@org/shared-util-loader';
import { SwiperOptions } from 'swiper/types';
import { WishlistStore } from '../../../../wishlist/store/wishlist.store';
import { Product } from '../../../../../shared/models/product.model';
import { ProductsCarouselComponent } from '../../../../../shared/components/products-carousel/products-carousel.component';
import { CartStore } from '../../../../cart/store/cart.store';
@Component({
  selector: 'app-related-products-section',
  imports: [
    CommonModule,
    TranslatePipe,
    LucideAngularModule,ProductsCarouselComponent
],
  templateUrl: './related-products-section.component.html',
  styleUrl: './related-products-section.component.scss',
})
export class RelatedProductsSectionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly productDataService = inject(ProductDataService);
  private readonly relatedProductsApiService = inject(RelatedProductsApiService);
  private readonly toastService = inject(ToastService);
  private readonly loader = inject(LoaderService);
  public translateService = inject(TranslateService);
  private readonly _wishlistStore = inject(WishlistStore);
  private readonly _cartStore = inject(CartStore);
  
  
 readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  relatedProducts = signal<Product[]>([]);
  wishlistedIds =  this._wishlistStore.wishlistedIds ;
  isRtl = computed(() => (this.translateService.currentLang()) === 'ar');
  
 

  ngOnInit(): void {
    this.loadRelatedProducts();
    
  }

  loadRelatedProducts(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id') || ''),
        filter((id) => !!id),
        switchMap((id) =>
          this.productDataService.getProductDetails(id).pipe(
            switchMap((res) => {
              const currentProduct = res?.payload?.product;
              const params = this.getRelatedProductsParams(currentProduct);

              return this.relatedProductsApiService
                .getRelatedProducts(params)
                .pipe(
                  map((productsRes) => {
                    const products = productsRes?.payload?.data || [];

                    return products
                      .filter(
                        (product: any) => product.id !== currentProduct?.id
                      )
                      .slice(0, 10);
                  })
                );
            }),
            catchError(() => of([])),
            this.loader.track<any[]>()
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (products) => {
          this.relatedProducts.set(products);
        },
      });
  }

  getRelatedProductsParams(product: any): RelatedProductsParams {
    const params: RelatedProductsParams = {
      limit: 10,
    };

    if (product?.subCategoryId) {
      params.subCategoryId = product.subCategoryId;
      return params;
    }

    if (product?.categoryId) {
      params.categoryId = product.categoryId;
      return params;
    }

    if (product?.occasions?.length) {
      params.occasionId = product.occasions[0]?.id;
      return params;
    }

    return params;
  }

  onCardDetailsClicked(product: any): void {
    this.router.navigate(['/products', product.id]);
  }

  onWishListClicked(product: Product): void {
    const wasWishlisted = this._wishlistStore.isWishlisted(product.id);
    
        this._wishlistStore.toggle(product.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next : () =>{
            this.toastService.show(
              this.translateService.instant(
                wasWishlisted ? 'WISHLIST.ITEM_REMOVED' : 'WISHLIST.ITEM_ADDED'
              ),
               wasWishlisted ? 'default' : 'success'
            );
          }
        });
  }

  onQuickViewClicked(product:any) {
    this.router.navigate(['/products', product.id]);
  }

  
  onAddToCartClicked(productId: string): void {
      if (this._cartStore.isProductInCart(productId)) {
      this.toastService.show(
      this.translateService.instant('CART.ALREADY_IN_CART'),
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
          this.translateService.instant('CART.PRODUCT_ADDED'),
          'success'
        );
    },
    error: (error) => {
      if (error === 'Insufficient stock.') {
        this.toastService.show(
          this.translateService.instant('CART.OUT_OF_STOCK'),
          'error'
        );
      }
    },
  });
  }

   get swiperConfig(): SwiperOptions {
    const rtl=this.isRtl();
    return{
       slidesPerView: 'auto',
      spaceBetween: 16,
    watchSlidesProgress: true,
    navigation: {
      nextEl: rtl ? '.related-products-prev' : '.related-products-next',
      prevEl: rtl ? '.related-products-next' : '.related-products-prev',
    }

    }
    
  }
}