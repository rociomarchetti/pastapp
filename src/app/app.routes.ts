import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: 'recipes',
        loadChildren: () =>
          import(
            './recipes/recipes-list/feature-recipes-list/recipes.routes'
          ).then((m) => m.RECIPES_ROUTES),
      },
      { path: '', redirectTo: 'recipes', pathMatch: 'full' },
    ],
  },
];
