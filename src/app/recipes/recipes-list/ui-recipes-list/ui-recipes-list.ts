import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Recipe, RecipeMatch } from '@shared/entities/recipe.model';
import { Card } from '@shared/ui/card/card';
import {
  CardFooterDirective,
  CardHeaderDirective,
} from '@shared/ui/card/card.directive';

@Component({
  selector: 'app-ui-recipes-list',
  imports: [Card, CardFooterDirective, CardHeaderDirective, CommonModule],
  templateUrl: './ui-recipes-list.html',
  styleUrl: './ui-recipes-list.scss',
})
export class UiRecipesList {
  isSearchActive = input<boolean>();
  activeRecipes = input<Recipe[]>([]);
  recipeMatches = input<RecipeMatch[]>([]);

  recipeSelected = output<Recipe>();
  recipeNavigate = output<string>();

  onCardClicked(recipe: Recipe) {
    this.recipeSelected.emit(recipe);
  }

  onGoToRecipeClicked(id: string) {
    this.recipeNavigate.emit(id);
  }

  get emptyStateMsg(): string {
    return this.isSearchActive()
      ? 'No se han encontrado resultados con esa búsqueda'
      : 'No quedan recetas en la lista';
  }
}
