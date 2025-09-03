import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '@core/services/recipe.service';
import { Recipe } from '@shared/entities/recipe.model';
import { RecipeForm } from '@recipes/shared/recipe-form/recipe-form';
import { RecipeDetailsComponent } from '../ui-details/recipe-details.component';

@Component({
  selector: 'app-recipe-details-feature',
  imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggle,
    ReactiveFormsModule,
    RecipeForm,
    RecipeDetailsComponent,
  ],
  templateUrl: './recipe-details.feature.html',
  styleUrl: './recipe-details.feature.scss',
})
export class RecipeDetailsFeature {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);

  recipeId = this.route.snapshot.paramMap.get('id')!;
  recipe = toSignal(this.recipeService.getRecipeById$(this.recipeId));
  editMode = signal(false);

  onSaveRecipe(updatedRecipe: Recipe): void {
    this.recipeService.updateRecipe$(updatedRecipe).subscribe(() => {
      this.editMode.set(false);
    });
  }
}
