import { Component, input, output } from '@angular/core';
import { RecipeMatch } from '@shared/entities/recipe.model';

@Component({
  selector: 'app-ui-recipes-matches',
  imports: [],
  templateUrl: './ui-recipes-matches.html',
  styleUrl: './ui-recipes-matches.scss',
})
export class UiRecipesMatches {
  recipeMatches = input<RecipeMatch[]>([]);

  recipeNavigate = output<string>();

  onGoToRecipeClicked(id: string) {
    this.recipeNavigate.emit(id);
  }
}
