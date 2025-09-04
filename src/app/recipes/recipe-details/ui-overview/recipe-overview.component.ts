import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DIFFICULTY_LEVELS, DifficultyLevel, Recipe } from '@recipes/entities';

@Component({
  selector: 'app-recipe-overview',
  imports: [MatIconModule],
  templateUrl: './recipe-overview.component.html',
  styleUrl: './recipe-overview.component.scss',
})
export class RecipeOverviewComponent {
  recipe = input<Recipe>();

  recipeBg = computed(() =>
    this.recipe()?.imgPath ? `url("${this.recipe()?.imgPath}")` : 'none'
  );

  getDifficultyLevel(level: DifficultyLevel | undefined): string | undefined {
    if (!level) return;
    return DIFFICULTY_LEVELS[level].toUpperCase() || '';
  }
}
