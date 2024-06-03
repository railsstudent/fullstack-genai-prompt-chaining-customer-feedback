import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'customer',
        loadChildren: () => import('./parent/parent.routes').then((m) => m.CUSTOMER_ROUTES)
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'customer/gemini'
    },
    {
        path: '**',
        redirectTo: 'customer/gemini'
    }
];
