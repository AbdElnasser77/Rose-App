import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { ProductsCarouselComponent } from '../../shared/components/products-carousel/products-carousel.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { WishlistStore } from '../../features/wishlist/store/wishlist.store';
import { ToastService } from '@org/shared-util-notification';
import { ProductDataService } from '../../features/products/services/product-details/product-data-api.service';
import { CartStore } from '../../features/cart/store/cart.store';
import { Product } from '../../shared/models/product.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-checkout-layout',
  imports: [RouterOutlet,OrderSummaryComponent,ProductsCarouselComponent,
           TranslatePipe,],
  templateUrl: './checkout-layout.component.html',
  styleUrl: './checkout-layout.component.scss',
})
export class CheckoutLayoutComponent implements OnInit{
  private readonly _router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _translateService = inject(TranslateService);
  private readonly _wishlistStore = inject(WishlistStore);
  private readonly _toastService = inject(ToastService);
  private readonly _productService = inject(ProductDataService);
  private readonly _cartStore = inject(CartStore);


   readonly isRtl = computed(() => this._translateService.currentLang() === 'ar');
   
   isCartPage = computed(() => this._router.url.includes('/cart'));

  readonly subtotal = this._cartStore.subtotal;
  readonly total = this._cartStore.total;
  readonly cartItems = this._cartStore.cartItems;

   readonly wishlistedIds = this._wishlistStore.wishlistedIds;

   suggestedProducts = signal<Product[]>([]);
  readonly appliedCoupon = this._cartStore.coupon;
   ngOnInit(): void {
    this.loadSuggestedProducts();
  }

  private loadSuggestedProducts(): void {
    this._productService
      .getProduct()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.suggestedProducts.set(res.payload.data);
        },
      });
  }

  onCardDetailsClicked(productId: string): void {
    this._router.navigate(['/products', productId]);
  }

  onWishListClicked(product: Product): void {
    const wasWishlisted = this._wishlistStore.isWishlisted(product.id);

    this._wishlistStore
      .toggle(product.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this._toastService.show(
            this._translateService.instant(
              wasWishlisted
                ? 'WISHLIST.ITEM_REMOVED'
                : 'WISHLIST.ITEM_ADDED'
            ),
            wasWishlisted ? 'default' : 'success'
          );
        },
      });
  }

  
    onAddToCartClicked(productId: string): void {
      if (this._cartStore.isProductInCart(productId)) {
      this._toastService.show(
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
        this._toastService.show(
          this._translateService.instant('CART.OUT_OF_STOCK'),
          'error'
        );
      } else {
        this._toastService.show(
          this._translateService.instant('CART.PRODUCT_ADDED'),
          'success'
        );
      }
    },
  });
  }


  // swiperConfig
    get swiperConfig(): SwiperOptions {
      const rtl=this.isRtl();
      return{
      spaceBetween: 16,
      watchSlidesProgress: true,
      navigation: {
        nextEl: rtl ? '.payment-products-prev' : '.payment-products-next',
        prevEl: rtl ? '.payment-products-next' : '.payment-products-prev',
      },
      breakpoints: {
        0: {
          slidesPerView: 1, 
        } ,
        640: {
        slidesPerView: 2,
        spaceBetween: 16,
        },
        1024: {
          slidesPerView: 3, 
          spaceBetween: 16,     
        },
         1280: {
          slidesPerView: 4, 
          spaceBetween: 16,     
        },
      },
  
      }
      
    }

  onApplyCoupon(code: string): void {
    console.log(code)
 }

 onCheckout(){
  this._router.navigate(['/checkout']);
 }
}
