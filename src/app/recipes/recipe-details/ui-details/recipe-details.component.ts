import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  DIFFICULTY_LEVELS,
  DifficultyLevel,
  Recipe,
} from '@shared/entities/recipe.model';

@Component({
  selector: 'app-recipe-details',
  imports: [MatIconModule],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss',
})
export class RecipeDetailsComponent {
  recipe = input<Recipe>();

  recipeBg = computed(() =>
    this.recipe()?.imgPath ? `url("${this.recipe()?.imgPath}")` : 'none'
  );

  getDifficultyLevel(level: DifficultyLevel | undefined): string | undefined {
    if (!level) return;
    return DIFFICULTY_LEVELS[level].toUpperCase() || '';
  }
}
