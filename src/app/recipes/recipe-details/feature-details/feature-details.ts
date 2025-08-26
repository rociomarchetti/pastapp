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
import { RecipeForm } from '@shared/ui/recipe-form/recipe-form';
import { UiDetails } from '../ui-details/ui-details';

@Component({
  selector: 'app-feature-details',
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
    UiDetails,
  ],
  templateUrl: './feature-details.html',
  styleUrl: './feature-details.scss',
})
export class FeatureDetails {
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
