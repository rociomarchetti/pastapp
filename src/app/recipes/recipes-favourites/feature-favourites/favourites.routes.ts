import { Routes } from '@angular/router';

export const FAVOURITES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./feature-favourites').then((m) => m.FeatureFavourites),
  },
];
