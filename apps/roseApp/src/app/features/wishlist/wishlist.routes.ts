import { Routes } from "@angular/router";
import { authGuard } from "@org/auth";

export const  wishlistRoutes: Routes = [
    {
         path: '',
        canActivate: [authGuard],
     loadComponent: () =>
      import('./pages/wishlist/wishlist.page').then(
        (m) => m.WishlistPage
      ),
      title:'Wishlist',
    }
];