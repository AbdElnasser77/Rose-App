import { Route } from '@angular/router';
import { RemoteEntry } from './entry';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';

export const remoteRoutes: Route[] = [
  
   {
    path: '',
    component: MainLayoutComponent,
  },
  
  
  
  
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
    // component: RemoteEntry,
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('../features/auth/auth.routes').then((m) => m.AuthRoutes),
  },
];
