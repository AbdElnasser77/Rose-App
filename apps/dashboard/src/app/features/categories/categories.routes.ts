import { Route } from '@angular/router';
import { AddCategoryPage } from './pages/add-category/add-category.page';
import { CategoriesPage } from './pages/category-list/categories.page';
import { UpdateCategoryPage } from './pages/update-category/update-category.page';

export const CategoriesRoutes: Route[] = [
  {
    path: 'add',
    component: AddCategoryPage,
    data: { breadcrumb: 'DASHBOARD.CATEGORIES.ADD_BREADCRUMB' },
    title: 'Add Category',
  },
  {
    path: ':id/edit',
    component: UpdateCategoryPage,
    data: { breadcrumb: 'DASHBOARD.CATEGORIES.UPDATE_BREADCRUMB' },
    title: 'Update Category',
  },
  {
    path: '',
    component: CategoriesPage,
    data: { breadcrumb: 'DASHBOARD.CATEGORIES.BREADCRUMB' },
    title: 'Categories',
  },
];
