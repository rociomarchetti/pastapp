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
import { Router } from '@angular/router';
import { RecipesList } from '@shared/ui/recipes-list/recipes-list';
import { UiRecipesMatches } from '../ui-recipes-matches/ui-recipes-matches';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '@shared/ui/snackbar/snackbar.service';

@Component({
  selector: 'app-recipes',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RecipesList,
    UiRecipesFilters,
    UiRecipesMatches,
    UiRecipeModal,
  ],
  standalone: true,
  templateUrl: './recipes.html',
  styleUrls: ['./recipes.scss'],
})
export class FeatureRecipes {
  private readonly router = inject(Router);
  private recipeService = inject(RecipeService);
  private snackbarService = inject(SnackbarService);

  isModalOpen = signal(false);
  selectedRecipe = signal<Recipe | null>(null);
  isSearchActive = signal(false);
  filtersChanged = signal<RecipeFilters | null>(null);

  recipes = toSignal(this.recipeService.getRecipes$(), { initialValue: [] });

  filteredRecipes = computed(() => {
    let recipes = this.recipes();
    recipes = this.filterRecipesBySearchTerm(recipes);
    recipes = this.filterRecipesByPrepTime(recipes);
    recipes = this.filterRecipesByDifficultyLevel(recipes);
    return recipes;
  });

  searchRecipeMatches = computed(() => {
    const term = this.filtersChanged()?.searchTerm?.toLowerCase();
    if (!term || term.length < 4 || !this.isSearchActive()) return [];

    return this.recipes().flatMap((recipe) => {
      const recipeMatch = recipe.name.toLowerCase().includes(term)
        ? recipe.name
        : null;

      const ingredientsMatch = recipe.ingredients
        .filter((ing) => ing.name.toLowerCase().includes(term))
        .map((ing) => ing.name);

      return recipeMatch || ingredientsMatch.length > 0
        ? [
            {
              recipeId: recipe.id,
              recipeName: recipe.name,
              recipeMatch: recipeMatch,
              ingredientsMatch,
            },
          ]
        : [];
    });
  });

  get activeRecipes() {
    return this.isSearchActive() ? this.filteredRecipes() : this.recipes();
  }

  onFiltersSearchUpdated(event: { filters: RecipeFilters | null }): void {
    if (
      !!event?.filters?.prepTime ||
      !!event?.filters?.searchTerm ||
      !!event?.filters?.difficulty
    ) {
      this.isSearchActive.set(true);
    } else {
      this.isSearchActive.set(false);
    }
    this.filtersChanged.set(event.filters);
  }

  onListCardRecipeClicked(recipe: Recipe): void {
    this.isModalOpen.set(true);
    this.selectedRecipe.set(recipe);
  }

  onListSeeRecipeClicked(id: string): void {
    this.redirectToRecipeDetails(id);
  }

  onModalClosed(): void {
    this.isModalOpen.set(false);
    this.selectedRecipe.set(null);
  }

  onModalShowDetailsClicked(recipeId: string): void {
    this.redirectToRecipeDetails(recipeId);
  }

  onToggleFavourite(recipeId: string): void {
    this.recipeService.toggleFavourite$(recipeId).subscribe({
      next: (updatedRecipes) => {
        const recipe = updatedRecipes.find((r) => r.id === recipeId);
        this.snackbarService.showFavouriteStatusUpdated(recipe?.isFavourite);
      },
      error: () => {
        this.snackbarService.showFavouriteStatusError();
      },
    });
  }

  redirectToRecipeDetails(id: string): void {
    this.router.navigateByUrl(`details/${id}`);
  }

  private filterRecipesBySearchTerm(recipes: Recipe[]): Recipe[] {
    const term = this.filtersChanged()?.searchTerm;
    if (!term) return recipes;

    return recipes.filter((recipe) => {
      const matchName = recipe.name.toLowerCase().includes(term);

      const matchIngredient = recipe.ingredients.some((ing) =>
        ing.name.toLowerCase().includes(term)
      );
      return matchName || matchIngredient;
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

  private filterRecipesByDifficultyLevel(recipes: Recipe[]): Recipe[] {
    const level = this.filtersChanged()?.difficulty;
    if (!level) return recipes;
    return recipes.filter((recipe) => recipe.difficultyLevel === level);
  }
}
