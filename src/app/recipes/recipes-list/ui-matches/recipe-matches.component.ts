import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RecipeMatch } from '@recipes/shared/entities';

@Component({
  selector: 'app-recipe-list-matches',
  imports: [CommonModule],
  templateUrl: './recipe-matches.component.html',
  styleUrl: './recipe-matches.component.scss',
})
export class RecipeMatchesComponent {
  recipeMatches = input<RecipeMatch[]>([]);

  recipeNavigate = output<string>();

  onGoToRecipeClicked(id: string) {
    this.recipeNavigate.emit(id);
  }
}
