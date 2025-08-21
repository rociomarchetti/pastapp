import {
  Component,
  input,
  OnChanges,
  OnInit,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Recipe } from '@shared/entities/recipe.model';
import { Modal } from '@shared/ui/modal/modal';

@Component({
  selector: 'app-ui-recipe-modal',
  imports: [Modal, MatExpansionModule, MatFormFieldModule],
  templateUrl: './ui-recipe-modal.html',
  styleUrl: './ui-recipe-modal.scss',
})
export class UiRecipeModal implements OnChanges {
  isModalOpen = input<boolean>(false);
  selectedRecipe = input<Recipe | null>();

  modalClosed = output<void>();
  modalShowDetailsClicked = output<string>();

  isInstructionsPanelOpen = signal(false);

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
