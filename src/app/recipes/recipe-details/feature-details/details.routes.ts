import { Routes } from '@angular/router';

export const DETAILS_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('./feature-details').then((m) => m.FeatureDetails),
  },
];
