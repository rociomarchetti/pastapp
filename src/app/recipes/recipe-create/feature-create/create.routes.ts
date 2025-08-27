import { Routes } from '@angular/router';

export const CREATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./feature-create').then((m) => m.FeatureCreate),
  },
];
