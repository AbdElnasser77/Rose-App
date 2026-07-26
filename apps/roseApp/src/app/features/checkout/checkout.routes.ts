import { Routes } from "@angular/router";
import { CheckoutLayoutComponent } from "../../layouts/checkout-layout/checkout-layout.component";

export const checkoutRoutes: Routes = [

  {
     path: '',
    component: CheckoutLayoutComponent,
    children: [
        //     {
        //     ShippingAddressPage,
        //   },
        {
         path: 'payment',
         loadComponent: () =>
         import('./pages/payment/payment.page').then((m) => m.PaymentPage),
         title: 'payment',
        }
    ],
    
  },
  
];