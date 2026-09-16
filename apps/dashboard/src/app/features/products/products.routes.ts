import { Route } from '@angular/router';
import { ProductsPage } from './pages/product-list/products.page';
import { AddProductPage } from './pages/add-product/add-product.page';
import { UpdateProductPage } from './pages/update-product/update-product.page';

export const ProductsRoutes: Route[] = [
  {
    path: 'add',
    component: AddProductPage,
    data: { breadcrumb: 'DASHBOARD.PRODUCTS.ADD_PRODUCT' },
    title: 'Add Product',
  },
  {
    path: ':id/edit',
    component: UpdateProductPage,
    data: { breadcrumb: 'DASHBOARD.PRODUCTS.UPDATE_PRODUCT' },
    title: 'Update Product',
  },
  {
    path: '',
    component: ProductsPage,
    data: { breadcrumb: 'DASHBOARD.PRODUCTS.TITLE' },
    title: 'Products',
  },
];