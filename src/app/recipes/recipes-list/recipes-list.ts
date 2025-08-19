import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { RecipeService } from '@core/services/recipe.service';
import { Recipe } from '@shared/entities/recipe.model';
import { Card } from '@shared/ui/card/card';
import {
  CardFooterDirective,
  CardHeaderDirective,
} from '@shared/ui/card/card.directive';
import { Modal } from '@shared/ui/modal/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-recipes-list',
  imports: [
    Card,
    CardHeaderDirective,
    CardFooterDirective,
    CommonModule,
    FormsModule,
    MatExpansionModule,
    Modal,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './recipes-list.html',
  styleUrls: ['./recipes-list.scss'],
})
export class RecipesList implements OnInit, OnDestroy {
  private recipeService = inject(RecipeService);
  private destroyed$: Subject<void> = new Subject<void>();

  isModalOpen = signal(false);
  selectedRecipe = signal<Recipe | null>(null);
  isInstructionsPanelOpen = signal(false);
  searchTerm = signal('');

  searchForm: FormGroup = new FormGroup({
    searchEntry: new FormControl(''),
  });

  recipes = toSignal(this.recipeService.getRecipes$(), { initialValue: [] });

  isSearchActive = computed(() => this.searchTerm().trim().length > 0);

  filteredRecipes = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const recipes = this.recipes();

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
  });

  ngOnInit(): void {
    this.initSearchFormSubscription();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.searchForm.reset();
  }

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

  get searchEntry() {
    return this.searchForm.get('searchEntry');
  }

  get instructionsPanelTitle(): string {
    return this.isInstructionsPanelOpen()
      ? `Cómo hacer ${this.selectedRecipe?.name ?? ''}`
      : 'Ver paso a paso';
  }

  private initSearchFormSubscription(): void {
    this.searchForm.get('searchEntry')?.valueChanges.subscribe((value) => {
      this.searchTerm.set(value || '');
    });
  }
}
