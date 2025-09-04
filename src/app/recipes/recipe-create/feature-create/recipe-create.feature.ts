import { Component, inject, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RecipeService } from '@core/services/recipe.service';
import { Recipe } from '@recipes/shared/entities';
import { RecipeForm } from '@recipes/shared/recipe-form/recipe-form';

@Component({
  selector: 'app-recipe-create-feature',
  imports: [RecipeForm, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './recipe-create.feature.html',
  styleUrl: './recipe-create.feature.scss',
})
export class RecipeCreateFeature {
  private recipeService = inject(RecipeService);

  recipeSaved = signal<boolean>(false);

  onCreateRecipe(newRecipe: Recipe): void {
    this.recipeService.addRecipe$(newRecipe).subscribe({
      next: () => this.recipeSaved.set(true),
    });
  }
}
