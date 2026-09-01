import { Route } from '@angular/router';
import { Root } from '../core/root/root';

export const remoteRoutes: Route[] = [
   {
        path: '',
        component: Root,
        children: []
    }
];
