import { Route } from '@angular/router';

import { NotificationsPage } from './pages/notifications/notifications.page';
import { mobileOnlyGuard } from './guards/mobile-only-guard';

export const notificationsRoutes: Route[] = [
  {
    path: '',
    canActivate: [mobileOnlyGuard],
    component: NotificationsPage,
  },
];
