import { Routes } from '@angular/router';

export const CREATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./recipe-create.feature').then((m) => m.RecipeCreateFeature),
  },
];
