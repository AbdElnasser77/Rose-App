import { Route } from '@angular/router';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('../features/auth/auth.routes').then((m) => m.AuthRoutes),
  },
  {
    path:'',
    component:MainLayoutComponent,
    children:[
      {
        path:'home',
        loadChildren: () =>
        import('../features/home/home.routes').then((m) => m.HomeRoutes),
      },
      // add products,cart,checkout all here.
    ]
  },
];
