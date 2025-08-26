import { Component, computed, input } from '@angular/core';
import { Recipe } from '@shared/entities/recipe.model';

@Component({
  selector: 'app-ui-details',
  imports: [],
  templateUrl: './ui-details.html',
  styleUrl: './ui-details.scss',
})
export class UiDetails {
  recipe = input<Recipe>();

  recipeBg = computed(() =>
    this.recipe()?.imgPath ? `url("${this.recipe()?.imgPath}")` : 'none'
  );
}
