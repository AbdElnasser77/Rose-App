import { Routes } from "@angular/router";

export const ProductDetailsRoutes: Routes = [
    {
        path:'',
        loadComponent: () => import('./pages/product-details/product-details.component').then((m) => m.ProductDetailsComponent),
        title:'Product details',
    }   

];