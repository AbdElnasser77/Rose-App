import { Route } from '@angular/router';
import { OccasionsPage } from './pages/occasions-list/occasions.page';
import { AddOccasionsComponent } from './pages/add-occasions/add-occasions.component';
import { UpdateOccasionsComponent } from './pages/update-occasions/update-occasions.component';

export const OccasionsRoutes: Route[] = [
  {
    path: '',
    data: { breadcrumb: 'occasions'},
    component: OccasionsPage,
    title: 'Products',
  },
  {
    path: 'add',
    data: { breadcrumb: "add occasions"},
    component: AddOccasionsComponent,
    title: 'Add Occasions',
  },
  {
    path: ':id/edit',
    data: { breadcrumb: "update occasions"},
    component: UpdateOccasionsComponent,
    title: 'Update Occasions',
  }
];