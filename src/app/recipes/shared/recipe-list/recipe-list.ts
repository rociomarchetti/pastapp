import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DIFFICULTY_LEVELS, DifficultyLevel, Recipe } from '@recipes/entities';
import { Card } from '@shared/ui/card/card';
import {
  CardBodyDirective,
  CardFooterDirective,
  CardHeaderDirective,
} from '@shared/ui/card/card.directive';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  imports: [
    Card,
    CardFooterDirective,
    CardHeaderDirective,
    CommonModule,
    MatIconModule,
    CardBodyDirective,
    RouterModule,
  ],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss',
})
export class RecipeList {
  isSearchActive = input<boolean>();
  activeRecipes = input<Recipe[]>([]);

  recipeSelected = output<Recipe>();
  toggleFavourite = output<string>();

  onCardClicked(recipe: Recipe): void {
    this.recipeSelected.emit(recipe);
  }

  onToggleFavourite(event: Event, id: string): void {
    event.stopPropagation();
    this.toggleFavourite.emit(id);
  }

  get emptyStateMsg(): string {
    return this.isSearchActive()
      ? 'No se han encontrado resultados con esa búsqueda'
      : 'No quedan recetas en la lista';
  }

  get emptyStateSubtitle(): string {
    return this.isSearchActive()
      ? 'Inténtalo de nuevo.'
      : 'Crea tus propias recetas.';
  }

  getDifficultyLevel(level: DifficultyLevel): string {
    return DIFFICULTY_LEVELS[level] || '';
  }
}
