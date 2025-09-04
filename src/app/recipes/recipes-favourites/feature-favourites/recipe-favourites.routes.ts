import { Routes } from '@angular/router';

export const FAVOURITES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./recipe-favourites.feature').then(
        (m) => m.RecipeFavouritesFeature
      ),
  },
];
