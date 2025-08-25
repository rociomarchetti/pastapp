import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '@core/services/recipe.service';

@Component({
  selector: 'app-feature-details',
  imports: [],
  templateUrl: './feature-details.html',
  styleUrl: './feature-details.scss',
})
export class FeatureDetails {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);

  recipeId = this.route.snapshot.paramMap.get('id')!;
  recipe = toSignal(this.recipeService.getRecipeById$(this.recipeId));

  recipeBg = computed(() =>
    this.recipe()?.imgPath ? `url("${this.recipe()?.imgPath}")` : 'none'
  );
}
