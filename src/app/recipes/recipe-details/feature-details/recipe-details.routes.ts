import { Routes } from '@angular/router';

export const DETAILS_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('./recipe-details.feature').then((m) => m.RecipeDetailsFeature),
  },
];
