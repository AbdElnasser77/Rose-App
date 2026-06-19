import { Routes } from '@angular/router';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';

export const AuthRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
     children: [
      {
        path:'',
        redirectTo: 'login',
        pathMatch : 'full'

      },
       {
        path:'send-email-verification',
       loadComponent: () =>
        import('./pages/send-email-verification/send-email-verification.component').then(
          (c)=>c.SendEmailVerificationComponent
        )
       },
       {
        path:'confirm-email-verification',
        loadComponent:() =>
          import ('./pages/confirm-email-verification/confirm-email-verification.component').then(
            (c)=>c.ConfirmEmailVerificationComponent
          )
       },
       {
        path:'register',
        loadComponent: () =>
          import ('./pages/register/register.component').then(
            (c)=>c.RegisterComponent
          )

       },
    ],
  },
];
