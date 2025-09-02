import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  OnChanges,
  output,
  SimpleChanges,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {
  DIFFICULTY_LEVELS,
  DifficultyLevel,
  Ingredient,
  Recipe,
} from '@shared/entities/recipe.model';
import { Button } from '@shared/ui/button/button';
import { Modal } from '@shared/ui/modal/modal';

@Component({
  selector: 'app-ui-recipe-modal',
  imports: [
    Button,
    CommonModule,
    Modal,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  templateUrl: './ui-recipe-modal.html',
  styleUrl: './ui-recipe-modal.scss',
})
export class UiRecipeModal implements OnChanges {
  isModalOpen = input<boolean>(false);
  selectedRecipe = input<Recipe | null>();

  modalClosed = output<void>();
  modalShowDetailsClicked = output<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRecipe'] && this.selectedRecipe()) {
      this.getRecipeBgImage();
    }
  }

  onCloseModal(): void {
    this.modalClosed.emit();
  }

  onSeeMoreDetailsClicked(recipeId: string): void {
    this.modalShowDetailsClicked.emit(recipeId);
  }

  get ingredients(): Ingredient[] | undefined {
    return this.selectedRecipe()?.ingredients.slice(0, 6);
  }

  getDifficultyLevel(level: DifficultyLevel | undefined): string | undefined {
    if (!level) return;
    return DIFFICULTY_LEVELS[level].toUpperCase() || '';
  }

  private getRecipeBgImage(): void {
    if (this.selectedRecipe()?.imgPath) {
      document.documentElement.style.setProperty(
        '--modal-header-image',
        `url("${this.selectedRecipe()?.imgPath}")`
      );
    } else {
      document.documentElement.style.removeProperty('--modal-header-image');
    }
  }
}
