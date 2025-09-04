import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private snackBar = inject(MatSnackBar);

  showFavouriteStatusUpdated(isFavourite: boolean | undefined) {
    if (isFavourite) {
      this.snackBar.open('¡Receta agregada a favoritos!', 'Cerrar', {
        duration: 2000,
      });
    } else {
      this.snackBar.open('Receta eliminada de favoritos', 'Cerrar', {
        duration: 2000,
      });
    }
  }

  showFavouriteStatusError() {
    this.snackBar.open('Error al actualizar favoritos', 'Cerrar', {
      duration: 3000,
    });
  }
}
