import { Component, inject, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RecipeService } from '@core/services/recipe.service';
import { Recipe } from '@shared/entities/recipe.model';
import { RecipeForm } from '@shared/ui/recipe-form/recipe-form';

@Component({
  selector: 'app-feature-create',
  imports: [RecipeForm, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './feature-create.html',
  styleUrl: './feature-create.scss',
})
export class FeatureCreate {
  private recipeService = inject(RecipeService);

  recipeSaved = signal<boolean>(false);

  onCreateRecipe(newRecipe: Recipe): void {
    this.recipeService.addRecipe$(newRecipe).subscribe({
      next: () => this.recipeSaved.set(true),
    });
  }
}
