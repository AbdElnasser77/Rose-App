import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { OrderSummaryComponent } from '../../../../shared/components/order-summary/order-summary.component';
import { ProductsCarouselComponent } from '../../../../shared/components/products-carousel/products-carousel.component';
import { SwiperOptions } from 'swiper/types';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { WishlistStore } from '../../../wishlist/store/wishlist.store';
import { ToastService } from '@org/shared-util-notification';
import { Product } from '../../../../shared/models/product.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductDataService } from '../../../products/services/product-details/product-data-api.service';
import { PaymentMethodCardComponent } from '../../components/payment-method-card/payment-method-card.component';
import { CheckoutStepperComponent } from '../../components/checkout-stepper/checkout-stepper.component';
import { LucideAngularModule,MoveRight, ArrowLeft} from 'lucide-angular';
import { CheckoutStore } from '../../store/checkout.store';
import { PaymentMethodModel } from '../../models/payment-method.model';
import { OrderService } from '../../services/order.service';
import { CreateOrderRequestModel } from '../../models/order/create-order-request.model';

@Component({
  selector: 'app-payment',
  imports: [OrderSummaryComponent ,ProductsCarouselComponent ,TranslatePipe
    ,PaymentMethodCardComponent,CheckoutStepperComponent,LucideAngularModule,],
  templateUrl: './payment.page.html',
  styleUrl: './payment.page.scss',
})
export class PaymentPage implements OnInit{
    protected _translateService = inject(TranslateService);
    private readonly _router = inject(Router);
    private readonly _wishlistStore = inject(WishlistStore);
    private readonly destroyRef = inject(DestroyRef);
    private _toastService = inject(ToastService);
    private productService = inject(ProductDataService);
    protected readonly _checkoutStore = inject(CheckoutStore);
    private readonly _orderService = inject(OrderService)
    
    suggestedProducts = signal<Product[]>([]);
     wishlistedIds = this._wishlistStore.wishlistedIds;
    isRtl = computed(() => (this._translateService.currentLang()) === 'ar');
    readonly MoveRight = MoveRight;
    readonly ArrowLeft = ArrowLeft;


    //  View details
    onCardDetailsClicked(productId: string): void {
    this._router.navigate(['/products',productId]);
   }
  //  WishList Clicked
   onWishListClicked(product: Product): void {
    const wasWishlisted = this._wishlistStore.isWishlisted(product.id);
    
        this._wishlistStore.toggle(product.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next : () =>{
            this._toastService.show(
              this._translateService.instant(
                wasWishlisted ? 'WISHLIST.ITEM_REMOVED' : 'WISHLIST.ITEM_ADDED'
              ),
               wasWishlisted ? 'default' : 'success'
            );
          }
        });
  }
  ngOnInit(): void {
    this.getProducts();
    const payment = this._checkoutStore.paymentMethod();

    if (payment) {
    this.selectedPayment = payment;
    }
  }

 
  getProducts(): void {
    this.productService.getProduct().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.suggestedProducts.set(res.payload.data) ;
    
      }
    });


  }
 
  

  onAddToCartClicked(productId: string) {
    console.log('onAddToCart',productId)
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

     selectedPayment = '';
    paymentMethods : PaymentMethodModel[] = [
      
      {
      id:'CASH',
      type: 'CASH',
      name: this._translateService.instant('PAYMENT.CASH.TITLE'),
      description: this._translateService.instant('PAYMENT.CASH.DESCRIPTION'),
      image:'assets/images/payment/cash.svg'
      },
      {
      id:'CREDIT_CARD',
      type: 'CREDIT_CARD',
      name: this._translateService.instant('PAYMENT.CREDIT_CARD.TITLE'),
      description: this._translateService.instant('PAYMENT.CREDIT_CARD.DESCRIPTION'),
      image:'assets/images/payment/credit.svg'
      }

    ];
    onPaymentSelected(id:string){
      const method = this.paymentMethods.find(x => x.id === id);
      if (!method) return;

      this.selectedPayment = id;
      this._checkoutStore.setPaymentMethod(method.type);
    }

    onBackClicked(){
      this._router.navigate(['/checkout/address']);
    }

    onCheckoutClicked(){
      const checkout = this._checkoutStore.checkoutState();

      if (!checkout.addressId) {
        this._toastService.show(
          this._translateService.instant('PAYMENT.ADDRESS_REQUIRED'),'error'
        );
         this._router.navigate(['/checkout/address']);
         return;
      }
      if (!checkout.paymentMethod) {
        this._toastService.show(
          this._translateService.instant('PAYMENT.PAYMENT_REQUIRED'),'error'
      );
       return;
      }

      const body :CreateOrderRequestModel = {
        addressId: checkout.addressId,
        paymentMethod: checkout.paymentMethod,
        couponCode: checkout.couponCode ?? undefined,
        notes: checkout.notes || undefined,
      };

      this._orderService.createOrder(body).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
        const order = res.payload.order;
        if (checkout.paymentMethod === 'CASH') {

            this._checkoutStore.clear();
            this._router.navigate(['/orders']);
          }
       },
      });
    } 

    
}
