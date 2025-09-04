import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RecipeMatch } from '@recipes/entities';

@Component({
  selector: 'app-recipe-list-matches',
  imports: [CommonModule],
  templateUrl: './recipes-matches.component.html',
  styleUrl: './recipes-matches.component.scss',
})
export class RecipeListMatches {
  recipeMatches = input<RecipeMatch[]>([]);

  recipeNavigate = output<string>();

  onGoToRecipeClicked(id: string) {
    this.recipeNavigate.emit(id);
  }
}
