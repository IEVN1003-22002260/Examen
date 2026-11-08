import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'pizzeria',
        loadComponent: () =>
            import('./pizzeria/pizzeria').then((c) => c.Pizzeria),
    },
    { path: '', redirectTo: 'pizzeria', pathMatch: 'full' },
    { path: '**', redirectTo: 'pizzeria' },
];