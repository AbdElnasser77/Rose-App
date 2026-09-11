import { Route } from '@angular/router';
import { ProductsPage } from './pages/product-list/products.page';
import { AddProductPage } from './pages/add-product/add-product.page';
import { UpdateProductPage } from './pages/update-product/update-product.page';

export const ProductsRoutes: Route[] = [
  {
    path: 'add',
    component: AddProductPage,
    title: 'Add Product',
  },
  {
    path: ':id/edit',
    component: UpdateProductPage,
    title: 'Update Product',
  },
  {
    path: '',
    component: ProductsPage,
    title: 'Products',
  },
];