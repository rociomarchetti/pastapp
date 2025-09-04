import { Routes } from '@angular/router';

export const RECIPES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./recipe-list.feature').then((m) => m.RecipeListFeature),
  },
];
