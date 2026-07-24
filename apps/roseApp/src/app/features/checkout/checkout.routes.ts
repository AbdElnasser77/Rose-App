import { Routes } from "@angular/router";

export const checkoutRoutes: Routes = [
//     {
//     ShippingAddressPage,
//   },
{
    path: 'payment',
    loadComponent: () =>
      import('./pages/payment/payment.page').then((m) => m.PaymentPage),
      title: 'payment',
  },
  
];