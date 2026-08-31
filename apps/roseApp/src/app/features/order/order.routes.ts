import { Routes } from "@angular/router";

export const OrderRoutes: Routes = [
    {
        path:'',
        loadComponent: () => import('./pages/order/order.page').then((m) => m.OrderComponent),
        title:'Orders',
    },
    
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/order/order.page').then(
        (m) => m.OrderComponent
      ),
    title: 'Orders',
  },

];