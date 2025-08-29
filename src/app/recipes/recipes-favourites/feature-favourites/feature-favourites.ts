import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { RecipeService } from '@core/services/recipe.service';
import { Recipe } from '@shared/entities/recipe.model';
import { RecipesList } from '@shared/ui/recipes-list/recipes-list';

@Component({
  selector: 'app-feature-favourites',
  imports: [RecipesList],
  templateUrl: './feature-favourites.html',
  styleUrl: './feature-favourites.scss',
})
export class FeatureFavourites {
  private readonly router = inject(Router);
  private recipeService = inject(RecipeService);

  favourites = toSignal(this.recipeService.getFavouriteRecipes$(), {
    initialValue: [],
  });

  onRecipeSelected(recipe: Recipe): void {
    this.router.navigateByUrl(`details/${recipe.id}`);
  }

  onToggleFavourite(recipeId: string): void {
    this.recipeService.toggleFavourite$(recipeId);
  }
}
