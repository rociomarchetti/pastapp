import { Component, inject } from '@angular/core';
import { RecipeService } from '@core/services/recipe.service';
import { Recipe } from '@shared/entities/recipe.model';
import { RecipeForm } from '@shared/ui/recipe-form/recipe-form';

@Component({
  selector: 'app-feature-create',
  imports: [RecipeForm],
  templateUrl: './feature-create.html',
  styleUrl: './feature-create.scss',
})
export class FeatureCreate {
  private recipeService = inject(RecipeService);

  onCreateRecipe(newRecipe: Recipe): void {
    this.recipeService
      .addRecipe$(newRecipe)
      .subscribe((value) => console.log(value));
  }
}
