import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      loadRemote<typeof import('roseApp/Routes')>('roseApp/Routes').then(
        (m) => m!.remoteRoutes,
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      loadRemote<typeof import('dashboard/Routes')>('dashboard/Routes').then(
        (m) => m!.remoteRoutes,
      ),
  },
];
