import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { RecipeService } from '@core/services/recipe.service';
import { Recipe } from '@shared/entities/recipe.model';
import { Button } from '@shared/ui/button/button';
import { RecipeList } from '@recipes/shared/recipe-list/recipe-list';
import { SnackbarService } from '@shared/ui/snackbar/snackbar.service';

@Component({
  selector: 'app-recipe-favourites-feature',
  imports: [Button, RecipeList],
  templateUrl: './recipe-favourites.feature.html',
  styleUrl: './recipe-favourites.feature.scss',
})
export class RecipeFavouritesFeature {
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
