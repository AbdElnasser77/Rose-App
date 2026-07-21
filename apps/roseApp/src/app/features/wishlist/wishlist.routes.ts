import { Routes } from "@angular/router";

export const  wishlistRoutes: Routes = [
    {
         path: '',
    loadComponent: () =>
      import('./pages/wishlist/wishlist.page').then(
        (m) => m.WishlistPage
      ),
      title:'Wishlist',
    }
];