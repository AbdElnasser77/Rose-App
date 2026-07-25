import { Routes } from "@angular/router";

export const checkoutRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/shipping-address/shipping-address.page').then(
        (m) => m.ShippingAddressPage
      ),
    title: 'shipping-address',
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('./pages/payment/payment.page').then((m) => m.PaymentPage),
      title: 'payment',
  },
  
];