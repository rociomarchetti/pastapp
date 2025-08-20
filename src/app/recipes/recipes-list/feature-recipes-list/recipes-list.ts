import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { RecipeService } from '@core/services/recipe.service';
import { PrepTimeRange, Recipe } from '@shared/entities/recipe.model';
import { Card } from '@shared/ui/card/card';
import {
  CardFooterDirective,
  CardHeaderDirective,
} from '@shared/ui/card/card.directive';
import { Modal } from '@shared/ui/modal/modal';

@Component({
  selector: 'app-recipes-list',
  imports: [
    Card,
    CardFooterDirective,
    CardHeaderDirective,
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatRadioButton,
    MatRadioGroup,
    Modal,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './recipes-list.html',
  styleUrls: ['./recipes-list.scss'],
})
export class RecipesList {
  private recipeService = inject(RecipeService);

  isModalOpen = signal(false);
  selectedRecipe = signal<Recipe | null>(null);
  isInstructionsPanelOpen = signal(false);
  PrepTimeRange = PrepTimeRange;

  searchForm: FormGroup = new FormGroup({
    searchTerm: new FormControl<PrepTimeRange | null>(null),
  });

  filtersForm: FormGroup = new FormGroup({
    prepTimeRange: new FormControl(''),
  });

  recipes = toSignal(this.recipeService.getRecipes$(), { initialValue: [] });

  searchTerm = toSignal(this.searchForm.get('searchTerm')!.valueChanges, {
    initialValue: '',
  });

  prepTimeRange = toSignal<PrepTimeRange | null>(
    this.filtersForm.get('prepTimeRange')!.valueChanges,
    {
      initialValue: null,
    }
  );

  isSearchActive = computed(
    () => !!this.searchTerm() || !!this.prepTimeRange()
  );

  filteredRecipes = computed(() => {
    let recipes = this.recipes();
    recipes = this.filterRecipesBySearchTerm(recipes);
    recipes = this.filterRecipesByPrepTime(recipes);
    return recipes;
  });

  onSelectRecipe(recipe: Recipe): void {
    this.isModalOpen.set(true);
    this.selectedRecipe.set(recipe);
    this.getRecipeBgImage(recipe?.imgPath);
  }

  onCloseModal(): void {
    this.isModalOpen.set(false);
  }

  onSeeMoreDetailsClicked(): void {
    console.log(this.selectedRecipe);
  }

  getRecipeBgImage(imgPath: string) {
    if (imgPath) {
      document.documentElement.style.setProperty(
        '--modal-header-image',
        `url("${imgPath}")`
      );
    } else {
      document.documentElement.style.removeProperty('--modal-header-image');
    }
  }

  private filterRecipesBySearchTerm(recipes: Recipe[]): Recipe[] {
    const term = this.searchTerm().toLowerCase().trim();

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
    const prepTime = this.prepTimeRange();
    return recipes.filter((recipe) => this.matchPrepTime(recipe, prepTime!));
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
