import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
import { CartStore } from '../../../cart/store/cart.store';
import { CreateOrderRequestModel } from '../../models/order/create-order-request.model';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment',
  imports: [ TranslatePipe
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
    private readonly _orderService = inject(OrderService);
    private readonly _cartStore = inject(CartStore);
    private readonly _paymentService = inject(PaymentService)

    suggestedProducts = signal<Product[]>([]);
     wishlistedIds = this._wishlistStore.wishlistedIds;
    isRtl = computed(() => (this._translateService.currentLang()) === 'ar');
    readonly MoveRight = MoveRight;
    readonly ArrowLeft = ArrowLeft;
   
    readonly subtotal = this._cartStore.subtotal;
    readonly total = this._cartStore.total;
     readonly cartItems = this._cartStore.cartItems;

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
    this._cartStore.loadCart();
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
      id:'CASH_ON_DELIVERY',
      type: 'CASH_ON_DELIVERY',
      name: this._translateService.instant('PAYMENT.CASH.TITLE'),
      description: this._translateService.instant('PAYMENT.CASH.DESCRIPTION'),
      image:'assets/images/payment/cash.svg'
      },
      {
      id:'CREDIT_CARD',
      type: 'CREDIT_CARD',
      name: this._translateService.instant('PAYMENT.CREDIT_CARD.TITLE'),
      description: this._translateService.instant('PAYMENT.CREDIT_CARD.DESCRIPTION'),
      image:'assets/images/payment/credit.svg',
      
      }

    ];
    onPaymentSelected(id:string){
      const method = this.paymentMethods.find(x => x.id === id);
      if (!method) return;

      // Bail before touching any state, so an unimplemented method can never end up in
      // the order body or enable the checkout button.
      if (method.disabled) {
        this._toastService.show(
          this._translateService.instant('PAYMENT.WORK_IN_PROGRESS'),'default'
        );
        return;
      }

      this.selectedPayment = id;
      this._checkoutStore.setPaymentMethod(method.type);
    }

    onBackClicked(){
      this._router.navigate(['/checkout']);
    }

    onCheckoutClicked(){
      if (!this._checkoutStore.addressId()) {
        this._toastService.show(
          this._translateService.instant('PAYMENT.ADDRESS_REQUIRED'),'error'
        );
         this._router.navigate(['/checkout']);
         return;
      }

      const paymentMethod = this._checkoutStore.paymentMethod();

      if (!paymentMethod) {
        this._toastService.show(
          this._translateService.instant('PAYMENT.PAYMENT_REQUIRED'),'error'
      );
       return;
      }

      const body = this._checkoutStore.orderRequest();

      if (!body) {
        return;
      }
      if (paymentMethod === 'CASH_ON_DELIVERY') {

         this. placeCashOrder(body);
         return;
      }

      if (paymentMethod === 'CREDIT_CARD') {
          this.startStripePayment(body);
       }

      
    }
    // Cash payment
    private  placeCashOrder(body: CreateOrderRequestModel){
      this._orderService.createOrder(body).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
           console.log(res)
            this._toastService.show(
              this._translateService.instant('PAYMENT.ORDER_PLACED'),'success'
            );
            this._checkoutStore.clear();
            this._cartStore.loadCart();
            // Temporary until the orders page exists.
            this._router.navigate(['/home']);
          
       },
      });
    }
    // Stripe payment
    private startStripePayment(body: CreateOrderRequestModel){
      this._orderService.createOrder(body).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next : (response) =>{
          const orderId = response.payload.order.id;

          this._paymentService.createIntent({orderId}).pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next : (intentResponse) =>{
              // Temporary until Stripe Elements integration is completed.
               this.confirmStripePayment(
                intentResponse.payload.paymentIntentId,
                'pm_card_visa'
              );
            }
          });
        }
      });
    }

    // Confirm stripe payment
    private confirmStripePayment(paymentIntentId: string,paymentMethodId: string):void{
      this._paymentService.confirmPayment({paymentIntentId,paymentMethodId}).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next :() =>{
          this._toastService.show(
            this._translateService.instant('PAYMENT.ORDER_PLACED'),
            'success'
          );
           this._checkoutStore.clear();
           this._cartStore.loadCart();

        this._router.navigate(['/home']);
        },
         error: () => {
        this._toastService.show(
          this._translateService.instant('PAYMENT.PAYMENT_FAILED'),
          'error'
        );
      },
      });
    }
}
