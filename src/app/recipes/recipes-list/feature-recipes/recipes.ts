import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipeService } from '@core/services/recipe.service';
import {
  PrepTimeRange,
  Recipe,
  RecipeFilters,
} from '@shared/entities/recipe.model';
import { UiRecipeModal } from '../ui-recipe-modal/ui-recipe-modal';
import { UiRecipesFilters } from '../ui-recipes-filters/ui-recipes-filters';
import { UiRecipesList } from '../ui-recipes-list/ui-recipes-list';

@Component({
  selector: 'app-recipes',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiRecipesFilters,
    UiRecipesList,
    UiRecipeModal,
  ],
  standalone: true,
  templateUrl: './recipes.html',
  styleUrls: ['./recipes.scss'],
})
export class FeatureRecipes {
  private recipeService = inject(RecipeService);

  isModalOpen = signal(false);
  selectedRecipe = signal<Recipe | null>(null);
  isSearchActive = signal(false);
  filtersChanged = signal<RecipeFilters | null>(null);

  recipes = toSignal(this.recipeService.getRecipes$(), { initialValue: [] });

  filteredRecipes = computed(() => {
    let recipes = this.recipes();
    recipes = this.filterRecipesBySearchTerm(recipes);
    recipes = this.filterRecipesByPrepTime(recipes);
    return recipes;
  });

  get activeRecipes() {
    return this.isSearchActive() ? this.filteredRecipes() : this.recipes();
  }

  onSearchUpdated(event: { filters: RecipeFilters | null }): void {
    if (!!event?.filters?.prepTime || !!event?.filters?.searchTerm) {
      this.isSearchActive.set(true);
    } else {
      this.isSearchActive.set(false);
    }
    this.filtersChanged.set(event.filters);
  }

  onRecipeSelected(recipe: Recipe): void {
    this.isModalOpen.set(true);
    this.selectedRecipe.set(recipe);
  }

  onModalClosed(): void {
    this.isModalOpen.set(false);
    this.selectedRecipe.set(null);
  }

  onModalShowDetailsClicked(recipeId: string): void {
    console.log(this.selectedRecipe);
  }

  private filterRecipesBySearchTerm(recipes: Recipe[]): Recipe[] {
    const term = this.filtersChanged()?.searchTerm;
    if (!term) return recipes;

    return recipes.filter((recipe) => {
      const matchName = recipe.name.toLowerCase().includes(term);

      const matchIngredient = recipe.ingredients.some((ing) =>
        ing.name.toLowerCase().includes(term)
      );

      const matchInstruction = recipe.instructions.some((instr) =>
        instr.toLowerCase().includes(term)
      );

      return matchName || matchIngredient || matchInstruction;
    });
  }

  private filterRecipesByPrepTime(recipes: Recipe[]): Recipe[] {
    const prepTime = this.filtersChanged()?.prepTime;
    if (!prepTime) return recipes;
    return recipes.filter((recipe) => this.matchPrepTime(recipe, prepTime));
  }

  private matchPrepTime(recipe: Recipe, prepTime: PrepTimeRange): boolean {
    switch (prepTime) {
      case PrepTimeRange.QUICK:
        return recipe.prepTimeMinutes < 30;
      case PrepTimeRange.NORMAL:
        return recipe.prepTimeMinutes >= 30 && recipe.prepTimeMinutes <= 40;
      case PrepTimeRange.CHEFMODE:
        return recipe.prepTimeMinutes > 40;
      default:
        return true;
    }
  }
}
