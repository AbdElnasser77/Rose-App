import { Route } from '@angular/router';

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
    path: 'home', // temporary routing. 
    loadComponent: () =>
      import('../layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
  },
];
