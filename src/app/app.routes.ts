import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: 'recipes',
        loadChildren: () =>
          import('./recipes/recipes-list/feature-recipes/recipes.routes').then(
            (m) => m.RECIPES_ROUTES
          ),
      },
      {
        path: 'details',
        loadChildren: () =>
          import(
            './recipes/recipe-details/feature-details/details.routes'
          ).then((m) => m.DETAILS_ROUTES),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./recipes/recipe-create/feature-create/create.routes').then(
            (m) => m.CREATE_ROUTES
          ),
      },
      { path: '', redirectTo: 'recipes', pathMatch: 'full' },
    ],
  },
];
