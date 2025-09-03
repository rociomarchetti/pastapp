import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { RecipeService } from '@core/services/recipe.service';
import { Recipe } from '@shared/entities/recipe.model';
import { Button } from '@shared/ui/button/button';
import { RecipesList } from '@recipes/shared/recipes-list/recipes-list';
import { SnackbarService } from '@shared/ui/snackbar/snackbar.service';

@Component({
  selector: 'app-feature-favourites',
  imports: [Button, RecipesList],
  templateUrl: './feature-favourites.html',
  styleUrl: './feature-favourites.scss',
})
export class FeatureFavourites {
  private readonly router = inject(Router);
  private recipeService = inject(RecipeService);
  private snackbarService = inject(SnackbarService);

  favourites = toSignal(this.recipeService.getFavouriteRecipes$(), {
    initialValue: [],
  });

  onRecipeSelected(recipe: Recipe): void {
    this.router.navigateByUrl(`details/${recipe.id}`);
  }

  onToggleFavourite(recipeId: string): void {
    this.recipeService.toggleFavourite$(recipeId).subscribe({
      next: (updatedRecipes) => {
        const recipe = updatedRecipes.find((r) => r.id === recipeId);
        this.snackbarService.showFavouriteStatusUpdated(recipe?.isFavourite);
      },
      error: () => {
        this.snackbarService.showFavouriteStatusError();
      },
    });
  }

  onGoToRecipesClicked(): void {
    this.router.navigateByUrl('/recipes');
  }
}
