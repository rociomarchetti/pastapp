import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  DifficultyLevel,
  getDifficultyLabel,
  Recipe,
} from '@recipes/shared/entities';

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
    return getDifficultyLabel(level);
  }
}
